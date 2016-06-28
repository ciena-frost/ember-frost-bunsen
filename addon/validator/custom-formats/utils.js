export const networkMaskMax = 32
export const networkMaskMin = 0

/**
 * Convert decimal value to binary representation
 * @param {Number} decimal - decimal value to convert to binary
 * @returns {String} string containing binary representation
 */
export function decimalToBinary (decimal) {
  return (decimal >>> 0).toString(2)
}

/**
 * Determine whether or not network mask is valid
 * @param {String} value - string representation of network mask
 * @returns {Boolean} whether or not network mask is valid
 */
export function networkMaskValid (value) {
  const networkMask = parseInt(value, 10)

  return (
    networkMask >= networkMaskMin &&
    networkMask <= networkMaskMax
  )
}

/**
 * Get bits representation of IP address
 * @param {String} ipAddress - IP address in dot notation (ie 127.0.0.1)
 * @returns {String} bits
 */
export function ipAddressBits (ipAddress) {
  return ipAddress.split('.')
    .map(decimalToBinary)
    .join('')
}
