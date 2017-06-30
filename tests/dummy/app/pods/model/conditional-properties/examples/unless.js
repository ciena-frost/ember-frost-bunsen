export default {
  type: 'object',
  properties: {
    foo: {
      type: 'boolean'
    },
    bar: {
      type: 'string',
      conditions: [{
        unless: [{
          foo: {equals: true}
        }]
      }]
    }
  }
}
