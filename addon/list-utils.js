/**
 * Utilitiy functions for working with lists, mainly used by select renderer
 */

import {utils} from 'bunsen-core'
const {ValueWrapper} = utils.path
import Ember from 'ember'
const {Logger, RSVP, get, typeOf} = Ember

const {isArray} = Array
const {keys} = Object

/**
 * set a list's available options
 * @param {String} bunsenId - the bunsen id for this property
 * @param {Object[]} data - initializes the list with this
 * @param {String} filter - the optional string to filter on
 * @param {Object} options - the bunsen model definition
 * @param {Object} store - the ember-data store
 * @param {Object} value - the current value object for the form instance
 * @param {Boolean} keepCurrentValue - determines whether we need to refetch for the current value
 * @returns {RSVP.Promise} a promise that resolves to a list of items
 */
export function getOptions ({ajax, bunsenId, data, filter = '', options, store, value, keepCurrentValue}) {
  // escape regexp metacharacters for local data filtering since filter is not a regular expression
  const safeFilter = filter.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
  const filterRegex = new RegExp(safeFilter, 'i')
  const filteredData = data.filter((item) => filterRegex.test(item.label))

  if (options.modelType) {
    return getItemsFromEmberData(
      {value, modelDef: options, data: filteredData, bunsenId, store, filter, keepCurrentValue})
  } else if (options.endpoint) {
    return getItemsFromAjaxCall({ajax, bunsenId, data: filteredData, filter, options, value})
  } else if (options.recordsPath) {
    return getItemsFromFormValue({bunsenId, data: filteredData, filter, options, value})
  }

  return RSVP.resolve(filteredData)
}

/**
 * Get query with property references replaced by property values.
 * @param {String} bunsenId - bunsen ID of property (used for relative references)
 * @param {String} filter - the partial match query filter to populate
 * @param {Object} query - query to process references in
 * @param {Object} value - the bunsen value for this form
 * @returns {Object} query object with references filled in
 */
export function getQuery ({bunsenId, filter, query, value}) {
  const result = utils.populateQuery(value, query, bunsenId)

  if (typeOf(result) !== 'object') {
    return result
  }

  // replace the special $filter placeholder with the filter value (if it exists)
  keys(result).forEach((key) => {
    const value = result[key]

    if (typeOf(value) === 'string') {
      result[key] = value.replace('$filter', filter)
    }
  })

  return result
}

/**
 * take enum values and make into a collection
 * @param  {String[]} values the values to make into a collection
 * @param {String} filter - filter
 * @returns {Object[]} a list of item objects
 */
export function getEnumValues (values = [], filter = '') {
  const filteredValues = []
  values.filter((value) => {
    if (!filter || value.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
      filteredValues.push({label: value.toString(), value})
    }
  })
  return filteredValues
}

/**
 * Fetch the list of items from an API endpoint
 * @param {Object} ajax - ember-ajax service
 * @param {Object} bunsenId - the bunsenId for this form
 * @param {Object[]} data - initializes the list with this
 * @param {String} filter - the partial match query filter to populate
 * @param {Object} options - bunsen model for this property plus view renderer options
 * @param {Object} value - the bunsen value for this form
 * @returns {RSVP.Promise} a promise that resolves with the list of items
 */
export function getItemsFromAjaxCall ({ajax, bunsenId, data, filter, options, value}) {
  const query = getQuery({
    bunsenId,
    filter,
    query: options.query,
    value
  })

  const queryString = keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')

  const url = queryString ? `${options.endpoint}?${queryString}` : options.endpoint

  return ajax.request(url)
    .then((result) => {
      const records = options.recordsPath ? get(result, options.recordsPath) : result

      if (!isArray(records)) {
        Logger.warn(
          `Expected an array of records at "${options.recordPath}" but got:`,
          records
        )

        return []
      }

      const {labelAttribute, valueAttribute} = options

      return normalizeItems({data, labelAttribute, records, valueAttribute})
    })
    .catch((err) => {
      Logger.error(`Error fetching endpoint "${options.endpoint}"`, err)
      throw err
    })
}

/* eslint-disable complexity */
/**
 * Fetch the list of network functions from the backend and set them
 * @param {Object} value the bunsen value for this form
 * @param {Object} modelDef the full bunsen model def for this property
 * @param {Object[]} data initializes the list with this
 * @param {Object} bunsenId the bunsenId for this form
 * @param {Object} store the ember-data store
 * @param {String} filter the partial match query filter to populate
 * @param {Boolean} keepCurrentValue determines whether we need to refetch for the current value
 * @returns {RSVP.Promise} a promise that resolves to the list of items
 */
export function getItemsFromEmberData ({value, modelDef, data, bunsenId, store, filter, keepCurrentValue = true}) {
  const modelType = modelDef.modelType || 'resources'
  const {labelAttribute, queryForCurrentValue, valueAttribute} = modelDef
  const valueAsId = get(value, bunsenId)
  let arrayValues
  if (isArray(valueAsId) && queryForCurrentValue) {
    arrayValues = valueAsId.asMutable() // frost-multi-select does not support immutable values
    arrayValues = RSVP.Promise.all(arrayValues.map((id) => store.findRecord(modelType, id)))
      .catch((err) => {
        Logger.log(`Error fetching ${modelType}`, err)
        throw err
      })
  }
  const actuallyFindCurrentValue = keepCurrentValue && queryForCurrentValue && valueAsId !== undefined && !arrayValues

  const query = getQuery({
    bunsenId,
    filter,
    query: modelDef.query,
    value
  })

  return RSVP.hash({
    items: store.query(modelType, query)
      .then((records) => {
        return normalizeItems({data, labelAttribute, records, valueAttribute})
      })
      .catch((err) => {
        Logger.log(`Error fetching ${modelType}`, err)
        throw err
      }),
    valueRecord: actuallyFindCurrentValue ? store.findRecord(modelType, valueAsId)
      .catch((err) => {
        Logger.log(`Error fetching ${modelType}`, err)
        throw err
      }) : RSVP.resolve(null),
    arrayRecords: arrayValues || RSVP.resolve(null)
  })
    .then(({arrayRecords, items, valueRecord}) => {
      if (actuallyFindCurrentValue &&
        shouldAddCurrentValue({items, valueRecord, labelAttribute, valueAttribute, filter})) {
        return normalizeItems({data: items, labelAttribute, records: [valueRecord], valueAttribute})
      }

      if (arrayRecords) {
        const recordsToAdd = arrayRecords.filter(record => {
          // Note: filtering current values out of multi-select data would clear those selections,
          // so we ignore the filter in this case (@theotherdude 1/10/2018)
          return shouldAddCurrentValue({items, valueRecord: record, labelAttribute, valueAttribute, filter: ''})
        })
        return normalizeItems({data: items, labelAttribute, records: recordsToAdd, valueAttribute})
      }
      return items
    })
}
/* eslint-enable complexity */

/**
 * Fetch the list of items from elsewhere in the form value
 * @param {Object[]} data - initializes the list with this
 * @param {String} filter - the partial match query filter to populate
 * @param {Object} options - bunsen model for this property plus view renderer options
 * @param {Object} value - the bunsen value for this form
 * @returns {RSVP.Promise} a promise that resolves with the list of items
 */
export function getItemsFromFormValue ({bunsenId, data, filter, options, value}) {
  const {recordsPath} = options

  let records
  if (recordsPath[0] === '.') {
    records = new ValueWrapper(value, bunsenId).get(recordsPath)
  } else {
    records = get(value, recordsPath)
  }

  if (!isArray(records)) {
    Logger.warn(
      `Expected an array of records at "${recordsPath}" but got:`,
      records
    )

    return RSVP.resolve([])
  }

  const {labelAttribute, valueAttribute} = options

  return RSVP.resolve(
    normalizeItems({data, labelAttribute, records, valueAttribute})
  )
}

/**
 * Converts records from an API response into a standard format with "label"
 * and "value" properties so renderers can predictably process the data.
 * @param {Object[]} data - initializes the list with this
 * @param {String} labelAttribute - dot notated path to label attribute in record
 * @param {Array<Object>} records - records to normalize
 * @param {String} valueAttribute - dot notated path to value attribute in record
 * @returns {Array<Object>} normalized items
 */
function normalizeItems ({data, labelAttribute, records, valueAttribute}) {
  const labelAttr = labelAttribute || 'label'
  const valueAttr = valueAttribute || 'id'

  return data.concat(
    records.map((record) => {
      if (typeof record !== 'object') {
        return {
          label: `${record}`, // make sure label is a string
          value: record
        }
      }

      let label, value

      if (labelAttr.indexOf('${') !== -1) {
        label = utils.parseVariables(record, labelAttr)
      } else {
        label = get(record, labelAttr) || get(record, 'title')
      }

      if (valueAttr.indexOf('${') !== -1) {
        value = utils.parseVariables(record, valueAttr)
      } else {
        value = get(record, valueAttr)
      }

      return {
        label,
        value
      }
    })
  )
}

/**
 * Determine whether or not valueRecord should be appended to data
 * @param {Object[]} items - the larger set of data
 * @param {EmberObject} valueRecord - the record to add or not
 * @param {String} labelAttribute - dot notated path to label attribute in record
 * @param {String} valueAttribute - dot notated path to value attribute in record
 * @param {String} filter - the partial match query filter to populate
 * @returns {boolean} true if valueRecord should be added to items
 */
function shouldAddCurrentValue ({items, valueRecord, labelAttribute, valueAttribute, filter}) {
  const filterRegex = new RegExp(filter, 'i')
  const valueRecordMatchesFilter = filterRegex.test(valueRecord.get(labelAttribute))
  const itemsContainsValueRecord = items.find(item => item.value === valueRecord.get(valueAttribute))
  return valueRecordMatchesFilter && !itemsContainsValueRecord
}
