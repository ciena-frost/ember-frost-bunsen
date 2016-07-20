/**
 * Validate value as a URL
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default function (value) {
  try {
    new URL(value) // eslint-disable-line no-new
    return true
  } catch (err) {
    return false
  }
}
