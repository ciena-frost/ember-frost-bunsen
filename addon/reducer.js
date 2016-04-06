import _ from 'lodash'
import {CHANGE_VALUE, VALIDATION_RESOLVED} from './actions'

const INITIAL_VALUE = {
  validationResult: {valid: false, warnings: [], errors: []},
  value: {}
}

// TODO: Update lodash and get rid of this
function unset (obj, path) {
  _.set(obj, path, undefined)
  const obStr = JSON.stringify(obj)
  return JSON.parse(obStr)
}

export default function (state, action) {
  console.log('calling reducer for action: ', action.type)
  switch (action.type) {
    case CHANGE_VALUE:
      let newState = _.cloneDeep(state)
      const {value, bunsenId} = action

      if (value === '' || (_.isArray(value) && value.length === 0)) {
        newState.value = unset(newState.value, bunsenId)
      } else {
        _.set(newState.value, bunsenId, value)
      }
      console.log(newState)
      return newState

    case VALIDATION_RESOLVED:
      const validationState = {
        value: _.cloneDeep(state.value),
        validationResult: action.validationResult
      }
      return validationState
    case '@@redux/INIT':
      return INITIAL_VALUE

    default:
      console.error(`Do not recognize action ${action.type}`)
  }
  return state
}
