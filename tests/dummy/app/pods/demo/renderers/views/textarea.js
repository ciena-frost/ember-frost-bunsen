export default {
  containers: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          properties: {
            cols: 2,
            rows: 4
          },
          renderer: 'textarea'
        }
      ]
    ]
  }],
  cells: [
    {
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
