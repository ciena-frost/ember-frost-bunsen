export default {
  type: 'object',
  properties: {
    superheroes: {
      type: 'array',
      items: {
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
          }
        }
      }
    }
  }
}
