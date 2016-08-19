export default {
  type: 'object',
  properties: {
    enumExample: {
      type: 'string',
      enum: [
        'value 1',
        'value 2',
        'value 3'
      ]
    },
    queryExample: {
      type: 'string',
      modelType: 'resource',
      valueAttribute: 'id',
      labelAttribute: 'label',
      query: {
        q: 'domainId:12345'
      }
    },
    multiSelectExample: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'value 1',
          'value 2',
          'value 3'
        ]
      }
    }
  },
  required: ['enumExample']
}
