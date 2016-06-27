/**
 * @reference https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 */

import int64 from './int64'

export const max = 4294967295
export const min = 0
export const reserved = [
  0,
  65535,
  4294967295
]

/**
 * Validate value as BGP (Border Gateway Protocol) AS (Autonomous System)
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is a valid
 */
export default function (value) {
  if (!int64(value)) {
    return false
  }

  return (
    value >= min &&
    value <= max &&
    (reserved).indexOf(value) === -1
  )
}
