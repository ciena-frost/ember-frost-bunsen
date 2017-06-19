import computed, {readOnly} from 'ember-computed-decorators'

import {AbstractInput} from 'ember-frost-bunsen'

function formatAddress ({street, city, state, zip}) {
  let value = ''
  if (street) {
    value += street
  }

  value += '\n'

  if (city) {
    value += city
  }

  if (state) {
    value += `, ${state}`
  }

  if (zip) {
    value += ` ${zip}`
  }
  return value
}
export default AbstractInput.extend({
  clasNames: [
    'address-renderer',
    'container-fluid'
  ],

  placeholder: '1383 North McDowell Blvd., Suite 300\nPetaluma, CA 94954',

  @readOnly
  @computed('bunsenId')
  renderValue (bunsenId) {
    const address = this.get(`value.${bunsenId}`) || {}
    const value = formatAddress(address)
    return value.trim()
  },

  /**
   * Parse a string address into it's parts
   * @param {String} value - the string address
   * @returns {Object} an address object
   */
  parseValue (value) {
    const [street, bottom] = value.split('\n')
    const [city, rest] = (bottom !== undefined) ? bottom.split(',') : [undefined, undefined]
    const [state, zip] = (rest !== undefined) ? rest.trim().split(' ') : [undefined, undefined]

    return {
      street,
      city,
      state,
      zip
    }
  }
})
