export default {
  definitions: {
    interface: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        adminState: {type: 'string'}
      },
      required: ['name', 'adminState']
    },
    element: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        interfaces: {
          type: 'array',
          items: {
            type: 'object',
            '$ref': '#/definitions/interface'
          }
        }
      },
      required: ['name', 'interfaces']
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
      required: ['host', 'firewall']
    }
  },
  required: ['network']
}
