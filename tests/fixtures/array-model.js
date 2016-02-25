export default {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      title: 'Name',
      properties: {
        first: {
          type: 'string',
          title: 'First'
        },
        last: {
          type: 'string',
          title: 'Last'
        }
      },
      required: [
        'first',
        'last'
      ]
    },
    addresses: {
      type: 'array',
      title: 'Addresses',
      items: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
            title: 'Street'
          },
          city: {
            type: 'string',
            title: 'City'
          },
          state: {
            type: 'string',
            title: 'State'
          },
          zip: {
            type: 'string',
            title: 'Zip'
          }
        },
        required: [
          'street',
          'city',
          'state',
          'zip'
        ]
      }
    }
  },
  required: [
    'name',
    'addresses'
  ]
}
