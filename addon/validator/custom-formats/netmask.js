/**
 * @reference https://en.wikipedia.org/wiki/Subnetwork
 */

import ipv4Address from './ipv4-address'

/**
 * Convert decimal value to binary representation
 * @param {Number} decimal - decimal value to convert to binary
 * @returns {String} string containing binary representation
 */
export function decimalToBinary (decimal) {
  return (decimal >>> 0).toString(2)
}

/**
 * Validate value as a netmask
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (!ipv4Address(value)) {
    return false
  }

  const binary = value.split('.')
    .map(decimalToBinary)
    .join('')

  return /^1*0*$/.test(binary)
}
