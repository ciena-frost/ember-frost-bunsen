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

function getSchema (pathStack, model) {
  const current = pathStack.pop()
  const currentSchema = model[current]
  if (pathStack.length <= 0) {
    return currentSchema
  } else if (currentSchema.properties) {
    return getSchema(pathStack, currentSchema.properties)
  } else if (currentSchema.items) {
    return getSchema(pathStack, currentSchema.items)
  } else {
    return {}
  }
}

function fillDefaults (value, path, model) {
  let schema
  if (path === null) {
    schema = model
  } else {
    const pathStack = path && path.split('.').reverse() || []
    schema = getSchema(pathStack, model.properties)
  }

  const schemaDefault = _.clone(schema.default)
  if (model.type === 'object') { // Recursing only makes sense for objects
    let subSchemaDefaults = {}
    _.each(schema.properties, function (subSchema, propName) {
      const foundDefaults = fillDefaults(value && value[propName], null, subSchema)
      if (foundDefaults !== undefined) {
        subSchemaDefaults[propName] = foundDefaults
      }
    })
    return _.defaults(schemaDefault || {}, subSchemaDefaults)
  } else if (value !== undefined) {
    return value
  }
  return schemaDefault
}

export function validate (bunsenId, inputValue, renderModel, validators) {
  return function (dispatch, getState) {
    const formValue = getState()['value']
    const previousValue = _.get(formValue, bunsenId)

    if (previousValue === undefined && _.isObject(inputValue)) {
      inputValue = fillDefaults(inputValue, bunsenId, renderModel)
    }

    dispatch(changeValue(bunsenId, inputValue))
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
