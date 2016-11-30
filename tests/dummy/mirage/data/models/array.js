export default {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      title: 'Full name',
      properties: {
        first: {
          type: 'string'
        },
        last: {
          type: 'string'
        }
      },
      required: ['first', 'last']
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          street: {
            type: 'string'
          },
          city: {
            type: 'string'
          },
          state: {
            type: 'string'
          },
          zip: {
            type: 'string'
          }
        },
        required: ['street', 'city', 'state', 'zip']
      },
      minItems: 1
    }
  },
  required: ['name', 'addresses']
}
