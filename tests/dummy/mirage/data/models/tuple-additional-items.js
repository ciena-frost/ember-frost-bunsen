export default {
  type: 'object',
  properties: {
    foo: {
      type: 'array',
      items: [{
        type: 'string'
      }, {
        type: 'boolean'
      }, {
        type: 'number'
      }],
      additionalItems: {
        type: 'string'
      }
    }
  }
}
