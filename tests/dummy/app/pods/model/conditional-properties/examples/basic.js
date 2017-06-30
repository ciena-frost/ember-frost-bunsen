export default {
  type: 'object',
  properties: {
    foo: {
      type: 'boolean'
    },
    bar: {
      type: 'string',
      conditions: [{
        if: [{
          foo: {equals: true}
        }]
      }]
    }
  }
}
