export default {
  type: 'object',
  properties: {
    name: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          title: 'First Name'
        },
        last: {
          type: 'string',
          title: 'Last Name'
        }
      },
      required: [
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
        }
      }
    },
    mother: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
              title: 'First Name'
            },
            last: {
              type: 'string',
              title: 'Last Name'
            }
          },
          required: [
            'last'
          ]
        }
      }
    }
  },
  required: [
    'name'
  ]
}
