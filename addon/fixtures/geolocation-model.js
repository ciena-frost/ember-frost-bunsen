import countries from './countries'

export default {
  properties: {
    address: {type: 'string'},
    city: {type: 'string'},
    country: {
      enum: countries.map((country) => country.name),
      type: 'string'
    },
    latitude: {type: 'string'},
    longitude: {type: 'string'},
    postalCode: {type: 'string'},
    state: {type: 'string'}
  },
  type: 'object'
}
