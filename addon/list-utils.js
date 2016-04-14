import * as utils from './utils'
import Ember from 'ember'

function promiseValue (value) {
  return new Ember.RSVP.Promise(function (resolve) {
    resolve(value)
  })
}

/**
 * set a list's available options
 * @param  {Object} modelDef the bunsen model definition
 * @param  {Object} dbStore the ember-data store
 * @returns {Promise} a promise that resolves to a list of items
 */
export function getOptions (value, modelDef, bunsenId, dbStore) {
  const enumDef = modelDef.enum
  const queryDef = modelDef.query
  if (enumDef) {
    return promiseValue(getEnumValues(enumDef))
  } else if (queryDef) {
    return getAsyncDataValues(value, modelDef, bunsenId, dbStore)
  }
  return promiseValue([])
}

/**
 * take enum values and make into a collection
 * @param  {String[]} values the values to make into a collection
 * @returns {Object[]} a list of item objects
 */
export function getEnumValues (values = []) {
  return values.map((value) => {
    const label = Ember.String.capitalize(
      value.split('-').join(' ').toLowerCase()
    )
    return {label, value}
  })
}

/**
 * Fetch the list of network functions from the backend and set them
 * @param  {Object} value the bunsen value for this form
 * @param  {Object} modelDef the full bunsen model def for this property
 * @param  {Object} bunsenId the bunsenId for this form
 * @param  {Object} dbStore the ember-data store
 * @returns {Promise} a promise that resolves to the list of items
 */
export function getAsyncDataValues (value, modelDef, bunsenId, dbStore) {
  const query = utils.populateQuery(value, modelDef.query, bunsenId)
  const modelType = modelDef.modelType || 'resources'
  return dbStore.query(modelType, query).then((resp) => {
    const items = resp.map((resource) => {
      const labelAttr = modelDef.labelAttribute || 'label'
      const valueAttr = modelDef.valueAttribute || 'id'
      const label = resource.get(labelAttr) || resource.get('title')
      const value = resource.get(valueAttr)
      return {
        label,
        value
      }
    })
    return items
  }).catch((err) => { // eslint-disable-line handle-callback-err
    Ember.Logger.log(`Error fetching ${modelType}`, err)
  })
}
