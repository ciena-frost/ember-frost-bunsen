/**
 * Utilitiy functions for working with lists, mainly used by select renderer
 */

import {utils} from 'bunsen-core'
import Ember from 'ember'
const {Logger, RSVP, get, typeOf} = Ember

const {isArray} = Array

/**
 * set a list's available options
 * @param  {String} bunsenId - the bunsen id for this property
 * @param  {Object[]} data - initializes the list with this
 * @param  {String} filter - the optional string to filter on
 * @param  {Object} options - the bunsen model definition
 * @param  {Object} store - the ember-data store
 * @param  {Object} value - the current value object for the form instance
 * @returns {RSVP.Promise} a promise that resolves to a list of items
 */
export function getOptions ({ajax, bunsenId, data, filter = '', options, store, value}) {
  const filterRegex = new RegExp(filter, 'i')
  const filteredData = data.filter((item) => filterRegex.test(item.label))

  if (options.modelType) {
    return getItemsFromEmberData(value, options, filteredData, bunsenId, store, filter)
  } else if (options.endpoint) {
    return getItemsFromAjaxCall({ajax, data: filteredData, filter, options, value})
  }

  return RSVP.resolve(filteredData)
}

export function getQuery ({bunsenId, filter, query, value}) {
  const result = utils.populateQuery(value, query, bunsenId)

  if (typeOf(result) !== 'object') {
    return result
  }

  // replace the special $filter placeholder with the filter value (if it exists)
  Object.keys(result).forEach((key) => {
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
      filteredValues.push({label: value, value})
    }
  })
  return filteredValues
}

export function getItemsFromAjaxCall ({ajax, data, filter, options, value}) {
  const query = getQuery({
    filter,
    query: options.query,
    value
  })

  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&')

  const url = queryString ? `${options.endpoint}?${queryString}` : options.endpoint

  return ajax.request(url)
    .then((result) => {
      const records = get(result, options.recordsPath)

      if (!isArray(records)) {
        Logger.warn(
          `Expected an array of records at "${options.recordPath}" but got:`,
          records
        )

        return []
      }

      const {labelAttribute, valueAttribute} = options

      return getItems({data, labelAttribute, records, valueAttribute})
    })
    .catch((err) => {
      Logger.error(`Error fetching endpoint "${options.endpoint}"`, err)
    })
}

/**
 * Fetch the list of network functions from the backend and set them
 * @param  {Object} value the bunsen value for this form
 * @param  {Object} modelDef the full bunsen model def for this property
 * @param  {Object[]} data initializes the list with this
 * @param  {Object} bunsenId the bunsenId for this form
 * @param  {Object} store the ember-data store
 * @param  {String} filter the partial match query filter to populate
 * @returns {RSVP.Promise} a promise that resolves to the list of items
 */
export function getItemsFromEmberData (value, modelDef, data, bunsenId, store, filter) {
  const modelType = modelDef.modelType || 'resources'
  const {labelAttribute, valueAttribute} = modelDef

  const query = getQuery({
    filter,
    query: modelDef.query,
    value
  })

  return store.query(modelType, query)
    .then((records) => {
      return getItems({data, labelAttribute, records, valueAttribute})
    }).catch((err) => {
      Logger.log(`Error fetching ${modelType}`, err)
      throw err
    })
}

function getItems ({data, labelAttribute, records, valueAttribute}) {
  const labelAttr = labelAttribute || 'label'
  const valueAttr = valueAttribute || 'id'

  return data.concat(
    records.map((record) => {
      const label = get(record, labelAttr) || record.get('title')
      const value = get(record, valueAttr)

      return {
        label,
        value
      }
    })
  )
}
