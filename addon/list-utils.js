/**
 * Utilitiy functions for working with lists, mainly used by select renderer
 */

import _ from 'lodash'
import Ember from 'ember'
const {Logger, RSVP} = Ember
import {getErrorMessage} from 'ember-frost-bunsen/utils'

import {utils} from 'bunsen-core'

/**
 * set a list's available options
 * @param  {Object} value the current value object for the form instance
 * @param  {Object} modelDef the bunsen model definition
 * @param  {Object[]} data initializes the list with this
 * @param  {String} bunsenId the bunsen id for this property
 * @param  {Object} store the ember-data store
 * @param  {String} filter the optional string to filter on
 * @returns {RSVP.Promise} a promise that resolves to a list of items
 */
export function getOptions (value, modelDef, data, bunsenId, store, filter = '') {
  const filteredData = data.filter((item) => {
    const filterRegex = new RegExp(filter, 'i')
    return filterRegex.test(item.label)
  })

  if (modelDef.modelType) {
    return getAsyncDataValues(value, modelDef, filteredData, bunsenId, store, filter)
  }

  return RSVP.resolve(filteredData)
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
export function getAsyncDataValues (value, modelDef, data, bunsenId, store, filter) {
  const query = utils.populateQuery(value, modelDef.query, bunsenId)
  const labelAttr = modelDef.labelAttribute || 'label'
  const valueAttr = modelDef.valueAttribute || 'id'

  // replace the special $filter placeholder with the filter value (if it exists)
  _.forIn(query, (value, key) => {
    if (_.isString(value)) {
      query[key] = value.replace('$filter', filter)
    }
  })

  const modelType = modelDef.modelType || 'resources'
  return store.query(modelType, query)
    .then((resp) => {
      const items = resp.map((resource) => {
        const label = resource.get(labelAttr) || resource.get('title')
        const value = resource.get(valueAttr)
        return {
          label,
          value
        }
      })

      return data.concat(items)
    }).catch((err) => {
      Logger.log(`Error fetching ${modelType}`, err)
      throw err
    })
}

function getWithDefault (obj, key, defaultVal) {
  const value = Ember.get(obj, key)
  if (value === undefined) {
    return defaultVal
  }
  return value
}

export function getDisplayValue (value, modelDef, bunsenId, store, onError) {
  const labelAttr = getWithDefault(modelDef, 'labelAttribute', 'label')
  const valueAttr = getWithDefault(modelDef, 'valueAttribute', 'id')

  if (labelAttr === valueAttr || modelDef.enum !== undefined || value === undefined) {
    return Ember.RSVP.resolve(value)
  }

  const extractDisplayValue = (record) => {
    return Ember.get(record, labelAttr)
  }

  const displayValueDirectly = (err) => {
    onError(bunsenId, [{
      path: bunsenId,
      message: getErrorMessage(err)
    }])
    return value
  }

  const modelType = getWithDefault(modelDef, 'modelType', 'resources')
  if (valueAttr === 'id') {
    return store.findRecord(modelType, value)
      .then(extractDisplayValue, displayValueDirectly)
  }

  const query = utils.populateQuery(value, modelDef.query, bunsenId)
  // Unset filter since we don't need it
  _.forIn(query, (value, key) => {
    if (_.isString(value) && value.indexOf('$filter') > -1) {
      delete query[key]
    }
  })

  return store.queryRecord(modelType, query)
    .then(extractDisplayValue, displayValueDirectly)
}
