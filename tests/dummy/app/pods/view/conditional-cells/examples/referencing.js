export default {
  model: {
    type: 'object',
    properties: {
      arrayOfFoo: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            foo: {
              type: 'object',
              properties: {
                showBar: {
                  type: 'boolean'
                },
                showBaz: {
                  type: 'boolean'
                },
                bar: {
                  type: 'object',
                  properties: {
                    baz: {
                      type: 'string'
                    },
                    quux: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          bar: {
            type: 'bar'
          }
        }
      }
    }
  },
  view: {
    type: 'form',
    version: '2.0',
    cells: [{
      model: 'arrayOfFoo',
      arrayOptions: {
        itemCell: {
          children: [{
            model: 'foo',
            children: [{
              model: 'showBar'
            }, {
              model: 'showBaz'
            }, {
              label: 'Bar',
              model: 'bar',
              children: [{
                model: 'quux'
              }, {
                model: 'baz',
                conditions: [{
                  if: [{
                    '../showBaz': {equals: true}
                  }]
                }]
              }],
              conditions: [{
                if: [{
                  './showBar': {equals: true}
                }]
              }]
            }]
          }]
        }
      }
    }]
  }
}
