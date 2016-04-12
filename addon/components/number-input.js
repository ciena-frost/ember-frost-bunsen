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
   * @returns {String} text to render
   */
  renderValue () {
    return _.toString(this.get('value'))
  },

  /**
   * Parse value into a number
   * @param {String} value - value to parse
   * @returns {Number} parse value
   */
  parseValue (value) {
    return parseFloat(value)
  }
})
