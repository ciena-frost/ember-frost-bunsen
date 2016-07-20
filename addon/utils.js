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
