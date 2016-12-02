import Ember from 'ember'
const {typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-json'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-json',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @readOnly
  @computed('lastValue', 'value')
  renderValue (lastValue, value) {
    if (typeOf(value) === 'object') {
      return JSON.stringify(value, null, 2) || lastValue
    }

    return value || lastValue
  },

  // == Functions ==============================================================

  /**
   * Convert value to a string for form input
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    const value = this._super(...arguments)

    this.set('lastValue', value)

    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }
})
