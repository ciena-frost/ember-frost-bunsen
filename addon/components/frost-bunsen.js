import Ember from 'ember'
const {Component, get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import SpreadMixin from 'ember-spread'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen'

const keys = [
  'autofocus',
  'disabled',
  'bunsenModel',
  'bunsenView',
  'focusedInput',
  'hook',
  'hookInputDelimiter',
  'hookPrefix',
  'onChange',
  'onError',
  'onFocusOut',
  'onFocusIn',
  'onInputFocusIn',
  'onInputFocusOut',
  'onTabChange',
  'onValidation',
  'registeredComponents',
  'renderers',
  'showAllErrors',
  'validators',
  'value'
]

export default Component.extend(SpreadMixin, HookMixin, {
  // == Component Properties ===================================================

  layout,
  tagName: '',

  // == Computed Properties ====================================================

  @readOnly
  @computed(...keys)
  passThroughOptions () {
    const options = {}

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = arguments[i]

      if (value !== undefined) {
        options[key] = arguments[i]
      }
    }

    return options
  },

  @readOnly
  @computed('bunsenView')
  type (view) {
    if (!view) {
      return 'form'
    }
    return get(view, 'type')
  }
})
