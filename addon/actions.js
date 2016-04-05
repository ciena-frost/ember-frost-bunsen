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
  // Group errors by input
  let errors = _.groupBy(validationResult.errors, 'path')

  // Filter errors to just be messages not complex objects
  errors = _.mapValues(errors, (fieldErrors, bunsenId) => _.pluck(fieldErrors, 'message'))

  // Use dot notation for keys instead of slash notation
  errors = _.mapKeys(errors, (value, key) => getPath(key))

  return {
    errors,
    type: VALIDATION_RESOLVED,
    validationResult // FIXME: I can probably go bye bye
  }
}

export function validate (bunsenId, inputValue, renderModel, validators) {
  return function (dispatch, getState) {
    dispatch(changeValue(bunsenId, inputValue))
    const formValue = getState()['value']
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
