import _ from 'lodash'
import Ember from 'ember'
const {Logger} = Ember
import {CHANGE_VALUE, VALIDATION_RESOLVED} from './actions'

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
  value: {}
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
      } else if (value === '' || (_.isArray(value) && value.length === 0)) {
        newState.value = unset(newState.value, bunsenId)
      } else {
        ensureParent(newState, bunsenId)
        _.set(newState.value, bunsenId, value)
      }
      return newState

    case VALIDATION_RESOLVED:
      const validationState = {
        errors: action.errors,
        value: state.value,
        validationResult: action.validationResult
      }
      return validationState
    case '@@redux/INIT':
      return INITIAL_VALUE

    default:
      Logger.error(`Do not recognize action ${action.type}`)
  }
  return state
}
