export default {
  containers: [{
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
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
