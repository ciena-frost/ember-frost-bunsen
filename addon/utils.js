import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {A} = Ember

export function deemberify (emberObject) {
  if (emberObject === null || emberObject === undefined) {
    return emberObject
  }

  if (_.isFunction(emberObject.serialize)) {
    return emberObject.serialize()
  }

  if (emberObject.content) {
    return emberObject.content.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  if (emberObject._prevContent) {
    return emberObject._prevContent.map((contentObject) => {
      return JSON.parse(JSON.stringify(contentObject._data))
    })
  }

  return JSON.parse(JSON.stringify(emberObject))
}

export function doesModelContainRequiredField (model) {
  if (_.isArray(model)) {
    for (var i = 0, len = model.length; i < len; i++) {
      if (doesModelContainRequiredField(model[i])) {
        return true
      }
    }

    return false
  }

  if (!_.isPlainObject(model)) {
    return false
  }

  if (!_.isEmpty(model.required)) {
    return true
  }

  for (let key in model) {
    if (doesModelContainRequiredField(model[key])) {
      return true
    }
  }
}

/**
 * Get the user-visible label from the model instance
 * @param {String} label - the label override from the view
 * @param {BunsenModel} model - the model (to get title from if present)
 * @param {String} id - the dotted refeference to this object
 * @returns {String} the user-visible label
 */
export function getLabel (label, model, id) {
  const title = model ? model.title : null
  let idLabel = (id) ? _.startCase(id.split('.').slice(-1)[0]) : ''
  idLabel = _.capitalize(idLabel.toLowerCase())
  return `${label || title || idLabel}`
}

/**
 * Convert a model reference to a proper path in the model schema
 *
 * hero.firstName => hero.attributes.firstName
 * foo.bar.baz => foo.attributes.bar.attributes.baz
 *
 * Leading or trailing '.' mess up our trivial split().join() and aren't valid anyway, so we
 * handle them specially, undefined being passed into _.get() will yield undefined, and display
 * the error we want to display when the model reference is invalid, so we return undefined
 *
 * hero. => undefined
 * .hero => undefined
 *
 * @param {String} reference - the dotted reference to the model
 * @param {String} [dependencyReference] - the dotted reference to the model dependency
 * @returns {String} the proper dotted path in the model schema (or undefined if it's a bad path)
 */
export function getModelPath (reference, dependencyReference) {
  const pattern = /^[^\.](.*[^\.])?$/
  let path = pattern.test(reference) ? `properties.${reference.split('.').join('.properties.')}` : undefined

  if (dependencyReference) {
    const dependencyName = dependencyReference.split('.').pop()
    const pathArr = path.split('.')
    pathArr.splice(-2, 0, 'dependencies', dependencyName)
    path = pathArr.join('.')
  }

  return path
}

/**
 * Get the sub-model for a given dotted reference
 * @param {BunsenModel} model - the starting model
 * @param {String} reference - the reference to fetch
 * @param {String} [dependencyReference] - the dotted reference to the model dependency (if any)
 * @returns {BunsenModel} the sub-model
 */
export function getSubModel (model, reference, dependencyReference) {
  const path = getModelPath(reference, dependencyReference)
  return _.get(model, path)
}

/**
 * Figure out an initial value based on existing value, initialValue, and model
 * @param {String} id - the dotted path to this value in the formValue
 * @param {Object} formValue - the existing value of the whole form
 * @param {*} initialValue - the initialValue passed in to the component
 * @param {Object} model - the model to check for a default value in
 * @param {*} defaultValue - the default value to use if no other defaults are found
 * @returns {*} the initial value
 */
export function getInitialValue (id, formValue, initialValue, model, defaultValue = '') {
  const values = [_.get(formValue, id), initialValue, model['default']]
  const value = _.find(values, (value) => value !== undefined)

  if (value !== undefined) {
    return value
  }

  return defaultValue
}

export function recursiveObjectCreate (object) {
  if (_.isPlainObject(object)) {
    let newObj = {}
    _.each(object, function (value, key) {
      newObj[key] = recursiveObjectCreate(value)
    })

    return Ember.Object.create(newObj)
  } else if (_.isArray(object)) {
    let newArray = []
    _.each(object, function (value) {
      newArray.push(recursiveObjectCreate(value))
    })

    return A(newArray) // eslint-disable-line new-cap
  }

  return object
}
