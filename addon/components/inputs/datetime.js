import computed, {readOnly} from 'ember-computed-decorators'
import moment from 'moment'

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

  @readOnly
  @computed('value')
  date (value) {
    const date = moment(value).format('YYYY-MM-DD')
    return /^\d{4}-\d\d-\d\d$/.test(date) ? date : ''
  },

  @readOnly
  @computed('value')
  time (value) {
    const time = moment(value).format('HH:mm:ss')
    return /^\d\d:\d\d:\d\d$/.test(time) ? time : ''
  },

  // == Functions ==============================================================

  parseValue (value) {
    return value.format('YYYY-MM-DDTHH:mm:ssZ')
  },

  // == Actions ===============================================================

  actions: {
  }
})
