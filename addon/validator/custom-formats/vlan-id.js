/**
 * @reference http://www.oit.ucsb.edu/committees/CNC-BEG/vlan_id.asp
 */

import int64 from './int64'

export const max = 4095
export const min = 0
export const reserved = [
  0,
  4095
]

/**
 * Validate value as a VLAN ID integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
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
