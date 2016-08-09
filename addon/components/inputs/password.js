import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-password'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-password',
    'frost-field'
  ],

  layout
})
