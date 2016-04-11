import computed from 'ember-computed-decorators'
import {AbstractInput} from 'ember-frost-bunsen'

export default AbstractInput.extend({
  clasNames: [
    'address-renderer',
    'container-fluid'
  ],

  placeholder: '1383 North McDowell Blvd., Suite 300\nPetaluma, CA 94954',

  @computed('bunsenId', 'value')
  renderValue (bunsenId) {
    let value = ''
    const address = this.get(`value.${bunsenId}`)

    if (address.street) {
      value += address.street
    }

    value += '\n'

    if (address.city) {
      value += address.city
    }

    if (address.state) {
      value += `, ${address.state}`
    }

    if (address.zip) {
      value += ` ${address.zip}`
    }

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
