import _ from 'lodash'
import computed from 'ember-computed-decorators'
import Input from './abstract-input'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Input.extend({
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
<<<<<<< HEAD
    let result = this._super(value)
    return parseFloat(result)
=======
    const number = parseFloat(value)
    return _.isFinite(number) ? number : null
>>>>>>> eb6862fd66237c3d5c08fbb6693391215121c0da
  }
})
