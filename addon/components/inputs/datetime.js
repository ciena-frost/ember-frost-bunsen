import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import moment from 'moment'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-datetime'
import {DEFAULT_TIMEZONE, getFormattedTime, getMomentTimezone} from 'ember-frost-bunsen/timezone-utils'

const {getWithDefault} = Ember
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
  DEFAULT_TIMEZONE,

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig')
  timezone (cellConfig) {
    return getWithDefault(cellConfig, 'renderer.options.timezone', '')
  },

  @readOnly
  @computed('cellConfig.renderer.options.defaultToCurrentDateTime')
  defaultToCurrentDateTime (defaultToCurrentDateTime = true) {
    return Boolean(defaultToCurrentDateTime)
  },

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
  @computed('defaultToCurrentDateTime', 'timezone', 'storedDateTimeValue')
  displayStoredDateTimeValue (defaultToCurrentDateTime, timezone, storedDateTimeValue) {
    if (!defaultToCurrentDateTime) {
      return storedDateTimeValue
    }

    // need to get rid of timezone offset so the time picker component doesn't alter the time
    return getMomentTimezone(storedDateTimeValue, timezone).format('YYYY-MM-DDTHH:mm:ss')
  },

  // == Functions ==============================================================

  parseValue (value) {
    return moment(value).format(DATE_TIME_FORMAT)
  },

  // == Lifecycle Hooks =======================================================

  init () {
    this._super(...arguments)

    const value = this.get('value')
    const timezone = this.get('timezone')
    let currentDateTime = getMomentTimezone(value, timezone)

    if (!this.get('defaultToCurrentDateTime')) {
      currentDateTime = value
    } else {
      currentDateTime = getFormattedTime(currentDateTime, this.get('dateTimeFormat'), timezone)
    }

    this.setProperties({
      storedDateTimeValue: currentDateTime,
      localTimezone: moment().format('Z')
    })
  },

  // == Actions ===============================================================

  actions: {
    /**
     * Sets the user's selected date and time to the bunsen model and stores it in the
     * case that the user selects away from the date-time picker radio button but then returns
     * @param {Object} value - the users selected date/time moment() object
     * @returns {undefined}
     */
    selectDate (value) {
      const timezone = this.get('timezone')
      const datetime = getMomentTimezone(value, timezone, true)
      const formattedTime = getFormattedTime(datetime, this.get('dateTimeFormat'), timezone)

      this.set('storedDateTimeValue', formattedTime)
      this.onChange(this.get('bunsenId'), formattedTime)
    }
  }
})
