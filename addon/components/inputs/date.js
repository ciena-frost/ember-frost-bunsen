import moment from 'moment'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-date'

const DATE_FORMAT = 'YYYY-MM-DD'

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

  init () {
    this._super(...arguments)
    this.set('currentValue', this.get('transformedValue') || moment().format(DATE_FORMAT))
  },

  // == Actions ===============================================================

  actions: {
  }
})
