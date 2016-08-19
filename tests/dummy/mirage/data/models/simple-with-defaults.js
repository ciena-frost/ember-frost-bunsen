export default {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      default: 'Bruce'
    },
    lastName: {
      type: 'string',
      default: 'Wayne'
    },
    alias: {
      type: 'string',
      title: 'Nickname',
      default: 'Batman'
    },
    onlyChild: {
      type: 'boolean',
      default: true
    },
    age: {
      type: 'number',
      title: 'Age'
    }
  },
  required: ['lastName']
}
