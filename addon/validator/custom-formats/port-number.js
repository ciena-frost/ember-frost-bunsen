/**
 * @reference https://en.wikipedia.org/wiki/Port_(computer_networking)
 */

import int64 from './int64'

const min = 0
const max = 65535
const reserved = [
  0
]

/**
 * Validate value as a port number integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (!int64(value)) {
    return false
  }

  const int = parseInt(value, 10)

  return (
    `${int}` === `${value}` &&
    int >= min &&
    int <= max &&
    (reserved).indexOf(int) === -1
  )
}
