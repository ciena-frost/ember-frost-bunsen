import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-datetime'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNameBindings: ['value:frost-bunsen-has-value'],

  classNames: [
    'frost-bunsen-input-datetime',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  // == Actions ===============================================================

  actions: {
  }
})
