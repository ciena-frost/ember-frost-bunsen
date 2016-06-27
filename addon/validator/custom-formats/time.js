import _ from 'lodash'

export function inRange (value, min, max) {
  const int = parseInt(value, 10)

  return (
    `${int}` === `${value.replace(/^0/, '')}` &&
    int >= min &&
    int <= max
  )
}

export default function (value) {
  let period

  if (!_.isString(value)) {
    return false
  }

  let [hours, minutes, seconds] = value.split(':')

  if (seconds) {
    [seconds, period] = seconds.split(' ')
  } else if (minutes) {
    [minutes, period] = minutes.split(' ')
  } else {
    [hours, period] = hours.split(' ')
  }

  // If am or pm was specified make sure hours are based on 12-hour clock
  if (period) {
    const normalizedPeriod = period.toLowerCase().replace(/\./g, '')

    if (['am', 'pm'].indexOf(normalizedPeriod) === -1) {
      return false
    }

    if (!inRange(hours, 0, 12)) {
      return false
    }
  }

  return (
    inRange(hours, 0, 23) &&
    (!minutes || inRange(minutes, 0, 59)) &&
    (!seconds || inRange(seconds, 0, 59))
  )
}
