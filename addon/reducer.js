const INITIAL_VALUE = {
  validationResult: {errors: []},
  value: {}
}

export default function (state, action) {
  console.log('calling reducer for action: ', action.type)
  return INITIAL_VALUE
}
