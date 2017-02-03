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

  // == State Properties =======================================================

  getDefaultProps () {
    if (this.get('value')) {
      var arr = this.get('value').split('T')

      return {
        date: arr[0] || '',
        time: arr[1] || ''
      }
    }

    return {
      date: '',
      time: ''
    }
  },

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  parseValue (value) {
    if (value.includes('-')) {
      this.set('date', value)
    } else {
      this.set('time', 'T' + value)
    }
    return this.get('date') + this.get('time')
  },

  // == Actions ===============================================================

  actions: {

  }
})
