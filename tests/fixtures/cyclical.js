export default {
  definitions: {
    interface: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        nestedInterface: {
          type: 'object',
          description: 'This is bad and will be considered invalid',
          '$ref': '#/definitions/interface'
        }
      },
      required: [
        'name',
        'adminState'
      ]
    },
    element: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        interfaces: {
          type: 'array',
          items: {
            type: 'object',
            '$ref': '#/definitions/interface'
          }
        }
      },
      required: [
        'name',
        'interfaces'
      ]
    }
  },
  type: 'object',
  properties: {
    network: {
      type: 'object',
      properties: {
        host: {
          type: 'object',
          '$ref': '#/definitions/element'
        },
        firewall: {
          type: 'object',
          '$ref': '#/definitions/element'
        }
      },
      required: [
        'host',
        'firewall'
      ]
    }
  },
  required: [
    'network'
  ]
}
