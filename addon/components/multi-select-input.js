import SelectInput from './select-input'

export default SelectInput.extend({
  classNames: [
    'frost-bunsen-input-multi-select',
    'frost-field'
  ],

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data
  }
})
