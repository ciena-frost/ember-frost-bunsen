export default {
  properties: {
    info: {
      properties: {
        people: {
          items: {
            properties: {
              age: {type: 'integer'},
              name: {
                properties: {
                  first: {type: 'string'},
                  last: {type: 'string'}
                },
                type: 'object'
              }
            },
            type: 'object'
          },
          type: 'array'
        }
      },
      type: 'object'
    }
  },
  type: 'object'
}
