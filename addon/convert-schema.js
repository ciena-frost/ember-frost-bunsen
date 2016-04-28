import _ from 'lodash'

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

// (value, condition)->boolean
function meetsCondition (value, condition) {
  let isConditionMet = false

  if (condition.equals) {
    isConditionMet = isConditionMet || _.isEqual(condition.equals, value)
  }

  if (condition.greaterThan) {
    isConditionMet = isConditionMet || value > condition.greaterThan
  }

  if (condition.lessThan) {
    isConditionMet = isConditionMet || value < condition.lessThan
  }

  return isConditionMet
}

function convertConditionalProperties (model, value, getPreviousValue) {
  if (model.type !== 'object' && model.type !== 'array' && model.properties === undefined) {
    return model
  }

  let retModel = _.cloneDeep(model)
  if (model.type === 'array' && _.isArray(value)) {
    let itemSchemas = []
    // Deep version of _.uniq
    const potentialSchemas = _.map(value, function (val) {
      return convertConditionalProperties(model.items, val, getPreviousValue)
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
  }

  let depsMet = {}
  let props = {}

  const getValue = pathFinder(value, getPreviousValue)

  _.each(retModel.properties, function (subSchema, propName) {
    retModel.properties[propName] = convertConditionalProperties(subSchema, _.get(value, propName), pathFinder(value, getValue))
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

export default convertConditionalProperties
