export default {
  properties: {
    foo: {
      dependencies: {
        useBar: {
          properties: {
            name: {type: 'string'}
          },
          type: 'object'
        },
        useBaz: {
          properties: {
            title: {type: 'string'}
          },
          type: 'object'
        }
      },
      properties: {
        useBar: {type: 'string'},
        useBaz: {type: 'string'}
      },
      type: 'object'
    }
  },
  type: 'object'
}
