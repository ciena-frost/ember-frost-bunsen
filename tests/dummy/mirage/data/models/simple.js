export default {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    alias: {
      type: 'string',
      title: 'Nickname'
    },
    onlyChild: {
      type: 'boolean'
    },
    age: {
      type: 'number',
      title: 'Age'
    }
  },
  required: ['lastName']
}
