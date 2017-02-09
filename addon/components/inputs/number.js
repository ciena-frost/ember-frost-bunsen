import Ember from 'ember'
const {typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-number'

const {isFinite} = Number

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-number',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @readOnly
  @computed('value')
  /**
   * Text to render for value
   * @param {Number} value - value
   * @returns {String} text to render
   */
  renderValue (value) {
    if ([null, undefined].indexOf(value) !== -1) {
      return ''
    }

    if (typeOf(value) === 'number') {
      return value.toString()
    }

    return value
  },

  // == Functions ==============================================================

  /**
   * Parse value into a number
   * @param {String} value - value to parse
   * @returns {Number} parse value
   */
  parseValue (value) {
    let result = null
    if (value !== undefined && value !== null) {
      const number = parseFloat(this._super(value))
      result = isFinite(number) ? number : null
    }
    return result
  }
})
