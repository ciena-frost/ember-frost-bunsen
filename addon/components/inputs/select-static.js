/**
 * The select static component
 */
import _ from 'lodash'
import Ember from 'ember'
const {inject} = Ember
import * as listUtils from 'ember-frost-bunsen/list-utils'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-static'

const PLACEHOLDER = '—'

const IMPORTANT_ATTRS = [
  'cellConfig',
  'value',
  'bunsenId'
]

function changedAttrs (newAttrs, oldAttrs, attrName) {
  if (oldAttrs === undefined) {
    return true
  }
  attrName = attrName + '.value'

  const newValue = Ember.get(newAttrs, attrName)
  const oldValue = Ember.get(newAttrs, attrName)

  return _.isEqual(newValue, oldValue)
}

export default AbstractInput.extend({
  // == Dependencies ===========================================================

  store: inject.service(),

  // == Component Properties ===================================================
  layout,

  classNames: [
    'frost-bunsen-input-static',
    'frost-field'
  ],

  // == Functions ==============================================================
  didReceiveAttrs ({oldAttrs, newAttrs}) {
    const hasChanged = _.partial(changedAttrs, newAttrs, oldAttrs)

    if (_.some(IMPORTANT_ATTRS, hasChanged)) {
      const cellConfig = this.get('cellConfig')
      const value = this.get('value')
      const bunsenId = this.get('bunsenId')
      const modelDef = this._getModelDef()
      const store = this.get('store')
      const onError = this.onError || _.noop
      listUtils.getDisplayValue(value, modelDef, bunsenId, store, onError.bind(this)).then(val => {
        if (_.isBoolean(val)) {
          return val ? 'true' : 'false'
        }

        if ([null, undefined, ''].indexOf(val) !== -1) {
          return _.get(cellConfig, 'placeholder') || PLACEHOLDER
        }
        return val
      }).then(renderValue => {
        this.set('renderValue', renderValue)
      })
    }
  },

  _getModelDef () {
    const cellConfig = this.get('cellConfig')
    const modelDef = this.get('bunsenModel')
    const options = _.get(cellConfig, 'renderer.options')

    if (options) {
      return _.assign({}, options, modelDef)
    }

    return modelDef
  },
  actions: {}
})
