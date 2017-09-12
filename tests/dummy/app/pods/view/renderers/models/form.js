export default {
  properties: {
    address: {
      type: 'object',
      properties: {
        street: {type: 'string'},
        city: {type: 'string'},
        zip: {type: 'string'}
      }
    },
    schemaType: {
      type: 'string',
      modelType: 'model',
      labelAttribute: 'label',
      valueAttribute: 'id'
    },
    userModel: {
      type: 'object',
      properties: {
        fieldName: {type: 'string'},
        fieldType: {
          type: 'string',
          enum: ['string', 'number']
        }
      }
    },
    dynamicObject1: {
      type: 'object'
    },
    dynamicObject2: {
      type: 'object'
    }
  },
  type: 'object'
}
