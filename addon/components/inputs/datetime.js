import computed, {readOnly} from 'ember-computed-decorators'
import moment from 'moment'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-datetime'

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORMAT = 'HH:mm:ss'
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

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
    const date = moment(value).format(DATE_FORMAT)
    return /^\d{4}-\d\d-\d\d$/.test(date) ? date : ''
  },

  @readOnly
  @computed('value')
  time (value) {
    const time = moment(value).format(TIME_FORMAT)
    return /^\d\d:\d\d:\d\d$/.test(time) ? time : ''
  },

  @readOnly
  @computed('value')
  currentValue (value) {
    if (!value) {
      return moment().format(DATE_TIME_FORMAT)
    }
    return value
  },

  // == Functions ==============================================================

  parseValue (value) {
    return moment(value).format(DATE_TIME_FORMAT)
  },

  // == Actions ===============================================================

  actions: {
  }
})
