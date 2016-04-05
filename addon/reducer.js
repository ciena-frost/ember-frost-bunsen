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
      _.set(newState, action.bunsenId, action.value)
      return newState
    case '@@redux/INIT':
      return INITIAL_VALUE
    default:
      console.error(`Do not recognize action ${action.type}`)
  }
  return state
}
