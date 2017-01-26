import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-date'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNameBindings: ['value:frost-bunsen-has-value'],

  classNames: [
    'frost-bunsen-input-date',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  // == Actions ===============================================================

  actions: {
    /**
     * Send the new date to handleChange()
     * @param {String} dateString - the selected date, formatted as YYYY-MM-DD
     */
    selectDate (dateString) {
      this.send('handleChange', dateString)
    }
  }
})
