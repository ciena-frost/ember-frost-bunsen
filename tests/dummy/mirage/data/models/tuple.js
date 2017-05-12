export default {
  type: 'object',
  properties: {
    foo: {
      type: 'array',
      items: [{
        type: 'object',
        properties: {
          bar: {
            type: 'string'
          }
        }
      }, {
        type: 'string'
      }, {
        type: 'number'
      }]
    }
  }
}
