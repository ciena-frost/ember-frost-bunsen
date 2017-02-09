import Ember from 'ember'
const {typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-boolean'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-boolean',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @readOnly
  @computed('value')
  /**
   * Text to render for value
   * @param {Boolean|String} value - value
   * @returns {Boolean} text to render
   */
  checked (value) {
    if ([null, undefined].indexOf(value) !== -1) {
      return false
    }

    if (typeOf(value) === 'string') {
      return value.toLowerCase() === 'true'
    }

    return value
  },

  // == Functions ==============================================================

  /**
   * Parse value into a number
   * @param {String} data - value to parse
   * @returns {Number} parse value
   */
  parseValue (data) {
    return data.value
  }
})
