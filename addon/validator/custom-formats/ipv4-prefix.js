/**
 * @reference https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation
 */

import _ from 'lodash'
import ipv4Address from './ipv4-address'

/**
 * Validate value as an IPv4 Prefix
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (!_.isString(value)) {
    return false
  }

  const [ipAddress, networkMask] = value.split('/')

  if (networkMask === undefined) {
    return false
  }

  if (!ipv4Address(ipAddress)) {
    return false
  }

  // TODO: validate network mask

  return true
}
