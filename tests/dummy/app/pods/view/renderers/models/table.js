export default {
  properties: {
    things: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: {type: 'string'},
          bar: {type: 'string'},
          baz: {type: 'string'}
        }
      }
    }
  },
  type: 'object'
}
