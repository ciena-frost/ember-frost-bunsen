import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-boolean',
    'frost-field'
  ],

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

    if (_.isString(value)) {
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
