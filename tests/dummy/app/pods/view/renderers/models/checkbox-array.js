export default {
  properties: {
    severity: {
      items: {
        enum: ['indeterminate', 'Critical', 'Major', 'minor', 'warning'],
        type: 'string'
      },
      type: 'array',
      'uniqueItems': true
    },
    serviceAffecting: {
      items: {
        enum: ['SERVICE_AFFECTING', 'NON_SERVICE_AFFECTING'],
        type: 'string'
      },
      type: 'array',
      'uniqueItems': true
    }
  },
  type: 'object'
}
