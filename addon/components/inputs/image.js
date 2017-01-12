import Ember from 'ember'
const {get} = Ember

import AbstractInput from './abstract-input'
import {getOption} from 'ember-frost-bunsen/input-utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-image'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-image',
    'frost-field'
  ],

  layout,

  // == Functions ==============================================================

  formValueChanged (newValue) {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return
    }

    const cellConfig = this.get('cellConfig')
    const rendererAlt = get(cellConfig, 'renderer.alt')
    const rendererSrc = get(cellConfig, 'renderer.src')
    const altContainsReferences = rendererAlt && rendererAlt.indexOf('${') !== -1
    const srcContainsReferences = rendererSrc && rendererSrc.indexOf('${') !== -1

    if (!altContainsReferences && !srcContainsReferences) {
      return
    }

    this.set('formValue', newValue)
  },

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  },

  didReceiveAttrs ({newAttrs, oldAttrs}) {
    const formValue = this.get('formValue')
    const props = {}
    const newAlt = getOption(newAttrs, 'alt', formValue, '', false)
    const newSrc = getOption(newAttrs, 'src', formValue)

    if (this.get('alt') !== newAlt) {
      props.alt = newAlt
    }

    if (this.get('src') !== newSrc) {
      props.src = newSrc
    }

    if (Object.keys(props).length !== 0) {
      this.setProperties(props)
    }
  }
})
