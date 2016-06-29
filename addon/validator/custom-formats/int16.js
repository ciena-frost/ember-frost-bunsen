import rangeFnFactory from './range-fn-factory'

export const max = 32767
export const min = -32768

/**
 * Validate value as a signed 16-bit integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default rangeFnFactory(min, max)
