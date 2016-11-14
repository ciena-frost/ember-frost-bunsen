export default {
  properties: {
    severity: {
      items: {
        enum: ['indeterminate', 'Critical', 'Major', 'minor', 'warning'],
        type: 'string'
      },
      type: 'array'
    },
    serviceAffecting: {
      items: {
        type: 'string'
      },
      type: 'array'
    },
    deviceType: {
      items: {
        enum: ['6500', 'Nuage'],
        type: 'string'
      },
      type: 'array'
    }
  },
  type: 'object'
}
