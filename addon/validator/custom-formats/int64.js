/**
 * Validate value as a signed 64-bit integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  if (isNaN(value)) {
    return false
  }

  const int = parseInt(value, 10)

  return `${int}` === `${value}`
}
