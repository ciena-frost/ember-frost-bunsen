export default {
  properties: {
    severity: {
      items: {
        enum: ['indeterminate', 'Critical', 'Major', 'minor', 'warning'],
        type: 'string'
      },
      type: 'array'
    }
  },
  type: 'object'
}
