import computed from 'ember-computed-decorators'
import FrostComponent from 'ember-frost-component'
import InputMixin from 'ember-frost-bunsen/mixins/input'

/**
 * Parse a string address into it's parts
 * @param {String} addressStr - the string address
 * @returns {Object} an address object
 */
function parseAddress (addressStr) {
  const [street, bottom] = addressStr.split('\n')
  const [city, rest] = (bottom !== undefined) ? bottom.split(',') : [undefined, undefined]
  const [state, zip] = (rest !== undefined) ? rest.trim().split(' ') : [undefined, undefined]

  return {
    street,
    city,
    state,
    zip
  }
}

export default FrostComponent.extend(InputMixin, {
  clasNames: [
    'address-renderer',
    'container-fluid'
  ],

  placeholder: '1383 North McDowell Blvd., Suite 300\nPetaluma, CA 94954',

  @computed('bunsenId', 'store.formValue')
  renderValue: function (bunsenId) {
    let value = ''
    const address = this.get(`store.formValue.${bunsenId}`)

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

  actions: {
    onChange: function (e) {
      const id = this.get('bunsenId')
      const value = parseAddress(e.target.value)
      const onChange = this.get('onChange')

      if (onChange) {
        onChange({id, value})
      }

      this.set('state.value', value)
    }
  }
})
