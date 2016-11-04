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
        enum: ['Yes', 'No', 'Unknown'],
        type: 'string'
      },
      type: 'array'
    },
    deviceType: {
      items: {
        enum: ['CN6500', 'NUAGE', 'OPENSTACK'],
        type: 'string'
      },
      type: 'array'
    }
  },
  type: 'object'
}
