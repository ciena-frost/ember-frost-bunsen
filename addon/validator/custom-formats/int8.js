import rangeFnFactory from './range-fn-factory'

export const max = 127
export const min = -128

/**
 * Validate value as a signed 8-bit integer
 * @param {Any} value - value to validate
 * @returns {Boolean} whether or not value is valid
 */
export default rangeFnFactory(min, max)
