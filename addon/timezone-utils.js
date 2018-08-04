import Ember from 'ember'
import moment from 'moment'
const {isBlank} = Ember

export const DEFAULT_TIMEZONE = 'local'
const DATE_TIME_TIMEZONE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

export function getMomentTimezone (time, timezone, keepLocalTime) {
  if (isBlank(timezone) || timezone === DEFAULT_TIMEZONE) {
    return moment(time).local()
  }

  return moment(time).utcOffset(timezone, keepLocalTime)
}

export function getFormattedTime (time, dateTimeFormat, timezone) {
  return isBlank(timezone) ? time.format(dateTimeFormat) : time.format(DATE_TIME_TIMEZONE_FORMAT)
}
