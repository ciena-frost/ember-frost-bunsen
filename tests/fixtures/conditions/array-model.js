/**
 * A bunsen model with conditions and an array
 */
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
            enum: ['untagged', 'single-tagged', 'double-tagged']
          },
          tag: {
            type: 'number',
            default: 20,
            multipleOf: 1.0,
            minimum: 0,
            maximum: 4094,
            conditions: [{
              if: [{
                tagType: {equals: 'single-tagged'}
              }, {
                tagType: {equals: 'double-tagged'}
              }]
            }]
          },
          tag2: {
            type: 'number',
            default: 3000,
            multipleOf: 1.0,
            minimum: 0,
            maximum: 4094,
            conditions: [{
              if: [{
                tagType: {equals: 'double-tagged'}
              }]
            }]
          }
        }
      }
    }
  }
}
