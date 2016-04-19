import _ from 'lodash'

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

export default function (model, value) {
  if (model.type !== 'object' && model.properties === undefined) {
    return model
  }

  let retModel = _.cloneDeep(model)

  let depsMet = {}
  let props = {}

  let conditionalProperties = _.transform(model.properties, function (result, schema, key) {
    if (schema.conditions) {
      result[key] = schema
    }
  })
  _.each(conditionalProperties, function (depSchema, key) {
    depsMet[key] = _.some(depSchema.conditions, function (enableConditions) {
      const hasDependencyMet = _.some(enableConditions.if, function (conditionList) {
        return _.every(conditionList, function (conditionValue, dependencyKey) {
          const dependencyValue = _.get(value, dependencyKey)
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
