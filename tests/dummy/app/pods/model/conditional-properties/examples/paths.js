export default {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tagType: {
            type: 'string',
            enum: ['single-tag', 'double-tag']
          },
          tag: {
            type: 'number',
            conditions: [{
              if: [{
                './tagType': {equals: 'single-tag'}
              }]
            }]
          },
          tag1: {
            type: 'number',
            conditions: [{
              if: [{
                './tagType': {equals: 'double-tag'}
              }]
            }]
          },
          tag2: {
            type: 'number',
            conditions: [{
              if: [{
                tagType: {equals: 'double-tag'}
              }]
            }]
          }
        }
      }
    }
  }
}
