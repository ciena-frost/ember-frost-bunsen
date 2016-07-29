export default {
  properties: {
    foo: {
      items: {
        enum: ['bar', 'baz'],
        type: 'string'
      },
      type: 'array'
    }
  },
  type: 'object'
}
