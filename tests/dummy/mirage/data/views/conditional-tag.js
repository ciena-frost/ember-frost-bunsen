export default {
  cellDefinitions: {
    tagType: {
      model: 'tagType'
    },
    tag: {
      model: 'tag',
      conditions: [{
        if: [{
          'tagType': {equals: 'tagged'}
        }]
      }]
    }
  },
  cells: [{
    children: [
      {extends: 'tagType'},
      {extends: 'tag'}
    ]
  }],
  type: 'form',
  version: '2.0'
}
