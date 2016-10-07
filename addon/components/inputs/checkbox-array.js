import AbstractInput from './abstract-input'
import computed, {readOnly} from 'ember-computed-decorators'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-checkbox-array'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-checkbox-array',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  selected: [],

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenModel')
  options (bunsenModel) {
    return bunsenModel.items.enum.map((key) => {
      return {
        value: key
      }
    })
  },

  // == Functions ==============================================================
  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    var selected = this.get('selected')
    if (data.value) {
      selected.push(data.id)
    } else {
      var index = selected.indexOf(data.value)
      selected.splice(index, 1)
    }
    return selected
  }
})
