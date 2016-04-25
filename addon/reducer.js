import _ from 'lodash'
import Ember from 'ember'
const {Logger} = Ember
import {CHANGE_VALUE, VALIDATION_RESOLVED, CHANGE_MODEL} from './actions'
import convertSchema from './convert-schema'

function ensureParent (state, id) {
  // If id does not have a parent the nothing to do
  if (_.isEmpty(id) || id.indexOf('.') === -1) {
    return
  }

  const segments = id.split('.')
  const idLastSegment = segments.pop()
  const relativePath = `value.${segments.join('.')}`

  const relativeObject = _.get(state, relativePath)
  const isArrayItem = /^\d+$/.test(idLastSegment)

  if (isArrayItem && !_.isArray(relativeObject)) {
    ensureParent(state, segments.join('.'))
    _.set(state, relativePath, [])
  } else if (!isArrayItem && !_.isPlainObject(relativeObject)) {
    ensureParent(state, segments.join('.'))
    _.set(state, relativePath, {})
  }
}

const INITIAL_VALUE = {
  errors: {},
  validationResult: {warnings: [], errors: []},
  value: null,
  model: {},
  baseModel: {}
}
export function initialStore (store) {
  return _.defaults(store, INITIAL_VALUE)
}

// TODO: Update lodash and get rid of this
function unset (obj, path) {
  _.set(obj, path, undefined)
  const obStr = JSON.stringify(obj)
  return JSON.parse(obStr)
}

export default function (state, action) {
  switch (action.type) {
    case CHANGE_VALUE:
      let newState = _.cloneDeep(state)
      const {value, bunsenId} = action

      if (bunsenId === null) {
        newState.value = value
      } else if ([null, ''].indexOf(value) !== -1 || (_.isArray(value) && value.length === 0)) {
        newState.value = unset(newState.value, bunsenId)
      } else {
        ensureParent(newState, bunsenId)
        _.set(newState.value, bunsenId, value)
      }
      newState.model = convertSchema(state.baseModel, newState.value)

      return newState

    case VALIDATION_RESOLVED:
      return _.defaults({
        validationResult: action.validationResult,
        errors: action.errors
      }, state)
    case CHANGE_MODEL:

      return _.defaults({
        baseModel: action.model,
        model: convertSchema(action.model, state.value)
      }, state)
    case '@@redux/INIT':
      if (state.baseModel) {
        state.model = convertSchema(state.baseModel, state.value || {})
      }
      return state || INITIAL_VALUE

    default:
      Logger.error(`Do not recognize action ${action.type}`)
  }
  return state
}
