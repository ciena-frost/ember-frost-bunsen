export default {
  model: {
    type: 'object',
    properties: {
      showUnits: {
        type: 'boolean'
      },
      size: {
        type: 'string'
      }
    }
  },
  view: {
    type: 'form',
    version: '2.0',
    cells: [{
      children: [{
        model: 'showUnits'
      }, {
        model: 'size',
        conditions: [{
          unless: [{
            showUnits: {equals: true}
          }]
        }, {
          if: [{
            showUnits: {equals: true}
          }],
          then: {
            label: 'Size (MB)'
          }
        }]
      }]
    }]
  }
}
