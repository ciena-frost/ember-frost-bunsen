export const max = 32767
export const min = -32768

/**
 * Validate value as a signed 16-bit integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (isNaN(value)) {
    return false
  }

  const int = parseInt(value, 10)

  return (
    `${int}` === `${value}` &&
    int >= min &&
    int <= max
  )
}