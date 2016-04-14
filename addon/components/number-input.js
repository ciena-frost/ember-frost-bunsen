import _ from 'lodash'
import computed from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  classNames: [
    'frost-bunsen-input-number',
    'frost-field'
  ],

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

    if (_.isNumber(value)) {
      return value.toString()
    }

    return value
  },

  /**
   * Parse value into a number
   * @param {String} value - value to parse
   * @returns {Number} parse value
   */
  parseValue (value) {
    const number = parseFloat(value)
    return _.isFinite(number) ? number : null
  }
})
