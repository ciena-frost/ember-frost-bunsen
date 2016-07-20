import _ from 'lodash'

/**
 * Validate value as a hex string
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is a valid
 */
export default function (value) {
  if (!_.isString(value)) {
    return false
  }

  return /^([0-9a-fA-F][0-9a-fA-F](:[0-9a-fA-F][0-9a-fA-F])*)?$/.test(value)
}
