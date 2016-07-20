import _ from 'lodash'
import moment from 'moment'

/**
 * Validate value as a date
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (
    _.isArray(value) ||
    _.isPlainObject(value) ||
    (_.isNumber(value) && parseInt(value, 10) !== value) ||
    [undefined, null].indexOf(value) !== -1
  ) {
    return false
  }

  return moment(value).isValid()
}
