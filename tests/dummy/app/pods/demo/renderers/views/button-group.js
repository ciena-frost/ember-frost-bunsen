export default {
  cellDefinitions: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          renderer: {
            name: 'button-group'
          }
        }
      ],
      [
        {
          model: 'bar',
          renderer: {
            name: 'button-group'
          }
        }
      ],
      [
        {
          model: 'baz',
          renderer: {
            name: 'button-group'
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
