export default {
  type: 'object',
  properties: {
    tagType: {
      type: 'string',
      enum: ['single-tag', 'double-tag']
    },
    tags: {
      type: 'object',
      properties: {
        tag1: {
          type: 'number'
        }
      },
      conditions: [{
        if: [{
          tagType: {equals: 'single-tag'}
        }]
      }, {
        if: [{
          tagType: {equals: 'double-tag'}
        }],
        then: {
          type: 'object',
          properties: {
            tag1: {
              type: 'number'
            },
            tag2: {
              type: 'string'
            }
          }
        }
      }]
    }
  }
}
