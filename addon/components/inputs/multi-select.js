import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-multi-select'

export default SelectInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-multi-select',
    'frost-field'
  ],

  layout,

  // == Functions ==============================================================

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data
  }
})
