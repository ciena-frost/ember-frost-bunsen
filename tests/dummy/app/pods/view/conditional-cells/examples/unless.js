export default {
  model: {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean'
      },
      bar: {
        type: 'string'
      }
    }
  },
  view: {
    type: 'form',
    version: '2.0',
    cells: [{
      children: [{
        model: 'foo'
      }, {
        model: 'bar',
        conditions: [{
          unless: [{
            foo: {equals: true}
          }]
        }]
      }]
    }]
  }
}
