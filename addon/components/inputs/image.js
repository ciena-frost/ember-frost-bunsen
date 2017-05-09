import {utils} from 'bunsen-core'
const {parseVariables} = utils
import Ember from 'ember'
const {get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-image'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-image',
    'frost-field'
  ],

  layout,

  @readOnly
  @computed('cellConfig')
  alt (cellConfig) {
    return (
      get(cellConfig, 'renderer.alt') ||
      get(cellConfig, 'renderer.options.alt')
    )
  },

  @readOnly
  @computed('alt', 'bunsenId', 'formValue')
  dereferencedAlt (alt, bunsenId, formValue) {
    return parseVariables(formValue, alt, bunsenId, true) || ''
  },

  @readOnly
  @computed('bunsenId', 'formValue', 'src', 'value')
  dereferencedSrc (bunsenId, formValue, src, value) {
    if (!src) return value
    return parseVariables(formValue, src, bunsenId, true) || ''
  },

  @readOnly
  @computed('cellConfig')
  src (cellConfig) {
    return (
      get(cellConfig, 'renderer.src') ||
      get(cellConfig, 'renderer.options.src')
    )
  },

  // == Functions ==============================================================

  formValueChanged (newValue) {
    const cellConfig = this.get('cellConfig')
    const rendererAlt = get(cellConfig, 'renderer.alt')
    const rendererSrc = get(cellConfig, 'renderer.src')
    const altContainsReferences = rendererAlt && rendererAlt.indexOf('${') !== -1
    const srcContainsReferences = rendererSrc && rendererSrc.indexOf('${') !== -1

    if (!altContainsReferences && !srcContainsReferences) return

    this.set('formValue', newValue)
  },

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  }
})
