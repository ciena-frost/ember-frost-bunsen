/**
 * The select input component
 */
import DropdownInput from './dropdown-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-select'

export default DropdownInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  layout,

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data[0]
  }
})
