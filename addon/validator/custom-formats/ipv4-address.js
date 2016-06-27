/**
 * @reference https://en.wikipedia.org/wiki/IPv4
 */

import _ from 'lodash'

export const max = 255
export const min = 0

/**
 * Validate value as an IPv4 address
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (!_.isString(value)) {
    return false
  }

  const octets = value.split('.')

  if (octets.length !== 4) {
    return false
  }

  for (var i = 0; i < 4; i++) {
    const octet = octets[i]
    const number = parseInt(octet, 10)

    // Make sure octet is within valid numeric range
    if (number < min || number > max) {
      return false
    }

    // If octet contains non-numeric characters it is invalid
    if (number.toString() !== octet) {
      return false
    }
  }

  return true
}
