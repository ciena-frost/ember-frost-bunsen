export const max = 2147483647
export const min = -2147483648

/**
 * Validate value as a signed 32-bit integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (isNaN(value)) {
    return false
  }

  const int = parseInt(value)

  return (
    `${int}` === `${value}` &&
    int >= min &&
    int <= max
  )
}
