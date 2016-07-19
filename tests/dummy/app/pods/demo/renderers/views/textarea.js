export default {
  cellDefinitions: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          properties: {
            cols: 2,
            rows: 4
          },
          renderer: {
            name: 'textarea'
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
