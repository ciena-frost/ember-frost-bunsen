/**
 * @module evaluate-conditions
 * Export a single function to accept a model schema which includes conditions and return one where the conditions are
 * evaluated/removed.
 */

import _ from 'lodash'
import dereference from './dereference'

function pathFinder (valueObj, prevPath) {
  return function (path) {
    if (!_.isArray(path)) {
      path = path.split('.').reverse()
    }
    let nextInPath = _.last(path)

    if (nextInPath === '') {
      path.pop()
      if (_.last(path) === '') {
        path.pop()
        path.push(path.pop().replace('/', ''))
        return prevPath(path)
      } else {
        path.push(path.pop().replace('/', ''))
      }
    }
    return _.get(valueObj, path.reverse().join('.'))
  }
}
const possibleConditions = {
  equals: _.isEqual,
  greaterThan: function (value, expected) { value > expected },
  lessThan: function (value, expected) { value < expected },
  notEqual: _.negate(_.isEqual)
}
// (value, condition)->boolean
function meetsCondition (value, condition) {
  return _.reduce(condition, function (memo, expected, conditionName) {
    return memo || possibleConditions[conditionName](value, expected)
  }, false)
}

export default function evaluate (model, value, getPreviousValue) {
  // In some error conditions, model might be empty, and not crashing helps in debugging
  // because the validation error can actually be seen then -- ARM
  if (!model) {
    return model
  }

  model = dereference(model).schema
  delete model.definitions

  if (model.type !== 'object' && model.type !== 'array' && model.properties === undefined) {
    return model
  }

  let retModel = _.cloneDeep(model)
  if (model.type === 'array') {
    if (_.isArray(value)) {
      let itemSchemas = []
      // Deep version of _.uniq
      const potentialSchemas = _.map(value, function (val) {
        return evaluate(model.items, val, getPreviousValue)
      })
      _.each(potentialSchemas, function (schema) {
        if (!_.some(itemSchemas, _.partial(_.isEqual, schema))) {
          itemSchemas.push(schema)
        }
      })
      if (itemSchemas.length > 1) {
        retModel.items = {anyOf: itemSchemas}
      } else {
        retModel.items = itemSchemas[0]
      }
    } else if (value === undefined) {
      retModel.items = evaluate(model.items, value, getPreviousValue)
    }
  } else {
    const aggregateType = _.find(['anyOf', 'oneOf'], _.partial(_.contains, _.keys(model)))
    if (aggregateType !== undefined) {
      retModel[aggregateType] = _.map(model[aggregateType], (subSchema) => {
        return evaluate(subSchema, value, getPreviousValue)
      })
    } else if (model.not) {
      retModel.not = evaluate(model.not, value, getPreviousValue)
    }
  }

  let depsMet = {}
  let props = {}

  const getValue = pathFinder(value, getPreviousValue)

  _.each(retModel.properties, function (subSchema, propName) {
    retModel.properties[propName] = evaluate(subSchema, _.get(value, propName), pathFinder(value, getValue))
  })
  let conditionalProperties = _.transform(model.properties, function (result, schema, key) {
    if (schema.conditions) {
      result[key] = schema
    }
  })
  _.each(conditionalProperties, function (depSchema, key) {
    depsMet[key] = _.some(depSchema.conditions, function (enableConditions) {
      const hasDependencyMet = _.some(enableConditions.if, function (conditionList) {
        return _.every(conditionList, function (conditionValue, dependencyKey) {
          const dependencyValue = getValue(dependencyKey)
          return meetsCondition(dependencyValue, conditionValue)
        })
      })
      if (hasDependencyMet && enableConditions.then !== undefined) {
        props[key] = _.cloneDeep(enableConditions.then)
      }
      return hasDependencyMet
    })
  })
  _.each(depsMet, function (dependencyMet, depName) {
    const baseSchema = retModel.properties[depName]
    if (dependencyMet && !baseSchema.set || !dependencyMet && baseSchema.set) {
      retModel.properties[depName] = _.omit(_.defaults(props[depName] || {}, baseSchema), ['conditions', 'set'])
    } else {
      delete retModel.properties[depName]
    }
  })

  return retModel
}
