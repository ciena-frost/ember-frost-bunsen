/**
 * @reference https://en.wikipedia.org/wiki/Port_(computer_networking)
 */

import rangeFnFactory from './range-fn-factory'

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
export default rangeFnFactory(min, max, reserved)
