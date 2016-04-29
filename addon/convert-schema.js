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

function convertConditionalProperties (model, value, getPreviousValue) {
  if (model.type !== 'object' && model.type !== 'array' && model.properties === undefined) {
    return model
  }

  let retModel = _.cloneDeep(model)
  if (model.type === 'array') {
    if (_.isArray(value)) {
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
    } else if (value === undefined) {
      retModel.items = convertConditionalProperties(model.items, value, getPreviousValue)
    }
  } else {
    const aggregateType = _.find(['anyOf', 'oneOf'], _.partial(_.contains, _.keys(model)))
    if (aggregateType !== undefined) {
      retModel[aggregateType] = _.map(model[aggregateType], (subSchema) => {
        return convertConditionalProperties(subSchema, value, getPreviousValue)
      })
    } else if (model.not) {
      retModel.not = convertConditionalProperties(model.not, value, getPreviousValue)
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

function rowCellParents (container, rowIndex, rowCell, rowCellIndex) {
  const subContainer = _.get(rowCell, 'container') || _.get(rowCell, 'item.container')

  if (subContainer) {
    this[subContainer](container, rowCellIndex, rowIndex)
  }
}

function rowParents (container, row, index) {
  _.each(row, rowCellParents.bind(this, container, index))
}

function findParentContainers (container, index) {
  _.each(container.rows, rowParents.bind(this, container.id))
}

export function convertView (model, view) {
  function getSchema (pathStack, model) {
    if (pathStack.length <= 0 || model === undefined) {
      return model
    }

    if (model.properties) {
      const current = pathStack.pop()
      return getSchema(pathStack, model.properties[current])
    }

    if (model.items) {
      return getSchema(pathStack, model.items)
    }
  }

  const parentContainers = {}

  // Build list of each cells referencing
  _.each(view.containers, findParentContainers.bind(parentContainers))

  function getNextContainer (containerData) {
    if (containerData) {
      return _.find(view.containers, function (container) {
        return container.id === containerData.container
      })
    }
  }
  function nextPathElement (containerData, nextContainer) {
    if (containerData) {
      return nextContainer.rows[containerData.rowIndex][containerData.rowCellIndex].model
    }
  }

  function getFullPath (containerID) {
    const path = []
    let containerData = parentContainers[containerID]
    let nextContainer = getNextContainer(containerData)
    let pathElement = nextPathElement(containerData, nextContainer)
    while (pathElement !== undefined) {
      path.push(pathElement)
      containerID = nextContainer.id
      containerData = parentContainers[containerID]
      nextContainer = getNextContainer(containerData)
      pathElement = nextPathElement(containerData, nextContainer)
    }
    return path
  }
  let newView = _.cloneDeep(view)

  // Filter out containers with non-existent properties
  newView.containers = _.filter(_.map(view.containers, function (container, containerIndex) {
    const newContainer = _.clone(container)
    newContainer.rows = _.filter(_.map(container.rows, function (row, rowIndex) {
      row = _.filter(_.map(row, function (rowCell) {
        const path = rowCell.model.split('.').reverse().concat(getFullPath(container.id))
        const schema = getSchema(path, model)
        if (schema !== undefined) {
          return rowCell
        }
      }))

      if (row.length > 0) {
        return row
      }
    }))
    if (newContainer.rows.length > 0) {
      return newContainer
    }
  }))
  return newView
}
