/**
 * Utilitiy functions for working with lists, mainly used by select renderer
 */

import _ from 'lodash'
import Ember from 'ember'
const {Logger, RSVP} = Ember

import * as utils from 'bunsen-core/utils'

/**
 * set a list's available options
 * @param  {Object} value the current value object for the form instance
 * @param  {Object} modelDef the bunsen model definition
 * @param  {String} bunsenId the bunsen id for this property
 * @param  {Object} dbStore the ember-data store
 * @param  {String} filter the optional string to filter on
 * @returns {RSVP.Promise} a promise that resolves to a list of items
 */
export function getOptions (value, modelDef, bunsenId, dbStore, filter = '') {
  const enumDef = modelDef.items ? modelDef.items.enum : modelDef.enum
  const queryDef = modelDef.query
  if (enumDef) {
    return RSVP.resolve(getEnumValues(enumDef, filter))
  } else if (queryDef) {
    return getAsyncDataValues(value, modelDef, bunsenId, dbStore, filter)
  }
  return RSVP.resolve([])
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
 * @param  {Object} bunsenId the bunsenId for this form
 * @param  {Object} dbStore the ember-data store
 * @param  {String} filter the partial match query filter to populate
 * @returns {RSVP.Promise} a promise that resolves to the list of items
 */
export function getAsyncDataValues (value, modelDef, bunsenId, dbStore, filter) {
  let query

  try {
    query = utils.populateQuery(value, modelDef.query, bunsenId)
  } catch (e) {
    return RSVP.reject(e)
  }

  const labelAttr = modelDef.labelAttribute || 'label'
  const valueAttr = modelDef.valueAttribute || 'id'

  // replace the special $filter placeholder with the filter value (if it exists)
  _.forIn(query, (value, key) => {
    query[key] = value.replace('$filter', filter)
  })

  const modelType = modelDef.modelType || 'resources'
  return dbStore.query(modelType, query).then((resp) => {
    const items = resp.map((resource) => {
      const label = resource.get(labelAttr) || resource.get('title')
      const value = resource.get(valueAttr)
      return {
        label,
        value
      }
    })
    return items
  }, function (err) {
    console.log(`it errored ${err}`)
  }).catch((err) => { // eslint-disable-line handle-callback-err
    Logger.log(`Error fetching ${modelType}`, err)
  })
}
