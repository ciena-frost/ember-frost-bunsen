import _ from 'lodash'
import {validateValue} from './validator/index'
import {aggregateResults} from './validator/utils'
import {getPath} from './dereference'

export const CHANGE_VALUE = 'CHANGE_VALUE'
export const VALIDATION_RESOLVED = 'VALIDATION_RESOLVED'

export function changeValue (bunsenId, value) {
  return {
    type: CHANGE_VALUE,
    bunsenId,
    value
  }
}

export function updateValidationResults (validationResult) {
  const errorsByInput = _.groupBy(validationResult.errors, 'path')
  const errorsFilteredToMessagesOnly = _.mapValues(errorsByInput, (fieldErrors, bunsenId) => _.pluck(fieldErrors, 'message'))
  const errorsMappedToDotNotation = _.mapKeys(errorsFilteredToMessagesOnly, (value, key) => getPath(key))

  return {
    errors: errorsMappedToDotNotation,
    type: VALIDATION_RESOLVED,
    validationResult // FIXME: I can probably go bye bye
  }
}

function invalidPath (refPath) {
  console.warn(`${refPath} is not a valid path`)
  return {}
}

function schemaFromRef (definitions) {
  if (_.isUndefined(definitions)) {
    return function (refPath) {
      const schema = invalidPath(refPath)
      console.warn('"$ref" can not be used, "definitions" is not defined for this schema')
      return schema
    }
  }

  return function (refPath, resolveRef) {
    const pathStack = refPath.split('/').reverse()
    if (pathStack.pop() !== '#' || pathStack.pop() !== 'definitions') {
      return invalidPath(refPath)
    }
    const startingSchema = definitions[pathStack.pop()]
    if (pathStack.length <= 0) {
      return startingSchema
    }
    return getSchema(pathStack, startingSchema, resolveRef)
  }
}

function getSchema (pathStack, model, resolveRef) {
  if (model.$ref !== undefined) {
    return resolveRef(model.$ref, resolveRef)
  }

  if (pathStack.length <= 0) {
    return model
  }

  if (model.properties) {
    const current = pathStack.pop()
    return getSchema(pathStack, model.properties[current], resolveRef)
  }

  if (model.items) {
    return getSchema(pathStack, model.items, resolveRef)
  }

  return {}
}

function findDefaults (value, path, model, resolveRef) {
  let schema

  if (model.$ref !== undefined) {
    schema = getSchema(null, model, resolveRef)
  } else if (path === null) {
    schema = model
  } else {
    const pathStack = path && path.split('.').reverse() || []
    schema = getSchema(pathStack, model, resolveRef)
  }
  const schemaDefault = _.clone(schema.default)
  if (model.type === 'object' || model.properties) { // Recursing only makes sense for objects
    let subSchemaDefaults = {}
    let hasDefaults = false
    _.each(schema.properties, function (subSchema, propName) {
      const defaults = findDefaults(value && value[propName], null, subSchema, resolveRef)
      if (defaults !== undefined) {
        subSchemaDefaults[propName] = defaults
        hasDefaults = true
      }
    })
    if (hasDefaults) { // If we didn't find any defaults, we don't want to try to modify the return
      return _.defaults(schemaDefault || {}, subSchemaDefaults)
    }
  } else if (value !== undefined) {
    return value
  }
  return schemaDefault
}

export function validate (bunsenId, inputValue, renderModel, validators) {
  return function (dispatch, getState) {
    let formValue = getState().value
    const previousValue = _.get(formValue, bunsenId)

    if (inputValue === undefined && previousValue === undefined) {
      const resolveRef = schemaFromRef(renderModel.definitions)
      inputValue = findDefaults(inputValue, bunsenId, renderModel, resolveRef)

      if (bunsenId === null && inputValue === undefined) {
        inputValue = {}
      }
    }

    dispatch(changeValue(bunsenId, inputValue))
    formValue = getState().value
    const result = validateValue(formValue, renderModel)

    const promises = []
    validators.forEach((validator) => {
      promises.push(validator(formValue))
    })

    Promise.all(promises)
      .then((snapshots) => {
        const results = _.pluck(snapshots, 'value')
        results.push(result)

        const aggregatedResult = aggregateResults(results)
        // TODO: Dispatch an err action
        dispatch(updateValidationResults(aggregatedResult))
      })
  }
}
