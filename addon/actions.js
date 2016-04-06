import {validateValue} from './components/validator/index'
import {aggregateResults} from './components/validator/utils'
import _ from 'lodash'

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
  return {
    type: VALIDATION_RESOLVED,
    validationResult
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
