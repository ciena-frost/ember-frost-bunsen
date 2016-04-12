import * as utils from './utils'
import Ember from 'ember'


function promiseValue (value) {
  return new Ember.RSVP.Promise(function (resolve) {
    resolve(value)
  })
}
/**
 * setOptions - set a list's available options
 * @param  {Object} modelDef the bunsen model definition
 * @param  {Object} dbStore the ember-data store
 * @returns {Promise} a promise that resolves to a list of items
 */
export function getOptions (modelDef, dbStore) {
  const enumDef = modelDef.get('enum')
  const queryDef = modelDef.get('query')
  let result
  if (enumDef) {
    result = promiseValue(getEnumValues(enumDef))
  } else if (queryDef) {
    result = getAsyncDataValues(modelDef, queryDef, dbStore)
  } else {
    result = promiseValue([])
  }
  return result
}

/**
 * getEnumValues - take enum values and make into a collection
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
 * setAsyncDataValues - Fetch the list of network functions from the backend and set them
 * @param  {Object} modelDef the full bunsen model def for this property
 * @param  {Object} queryDef the query obj from the model def
 * @param  {Object} dbStore the ember-data store
 * @returns {Promise} a promise that resolves to the list of items
 */
export function getAsyncDataValues (modelDef, queryDef, dbStore) {
  const query = utils.createOrchQuery(queryDef)
  const modelType = modelDef.get('modelType') || 'resources'
  return dbStore.query(modelType, query).then((resp) => {
    const items = resp.map((resource) => {
      const labelAttr = modelDef.get('labelAttribute') || 'label'
      const valueAttr = modelDef.get('valueAttribute') || 'id'
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
