import _ from 'lodash'

const INITIAL_VALUE = {
  validationResult: {valid: false, warnings: [], errors: []},
  value: {}
}

export default function (state, action) {
  console.log('calling reducer for action: ', action.type)
  switch (action.type) {
    case 'update':
      const newState = _.cloneDeep(state)

      const newValue = action.value === '' ? undefined : action.value
      _.set(newState, 'value.' + action.bunsenId, newValue)
      console.log(JSON.stringify(newState, null, '  '))
      return newState
    case 'validate':
      const validationState = {
        value: _.cloneDeep(state.value),
        validationResult: action.validationResult
      }
      console.log(JSON.stringify(validationState, null, '  '))
      return validationState
    case '@@redux/INIT':
      return INITIAL_VALUE
    default:
      console.error(`Do not recognize action ${action.type}`)
  }
  return state
}
