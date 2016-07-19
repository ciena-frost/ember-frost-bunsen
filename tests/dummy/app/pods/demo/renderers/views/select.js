export default {
  cellDefinitions: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          renderer: {
            name: 'select'
          }
        }
      ]
    ]
  }],
  cells: [
    {
      extends: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
