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
        host: {'$ref': '#/definitions/element'},
        firewall: {'$ref': '#/definitions/element'}
      },
      required: ['host', 'firewall']
    }
  },
  required: ['network']
}
