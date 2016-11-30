import computed, {readOnly} from 'ember-computed-decorators'
import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-multi-select'

export default SelectInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-multi-select',
    'frost-field'
  ],

  layout,

  @readOnly
  @computed('value')
  /**
   * A mutable version of value, since multi-select currently relies on mutability
   * @param {Array} val - the value
   * @returns {Array} the mutable value
   */
  mutableValue (val) {
    if (typeof val === 'object' && 'asMutable' in val) {
      return val.asMutable({deep: true})
    }

    return val
  },

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
