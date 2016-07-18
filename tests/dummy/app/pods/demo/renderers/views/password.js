export default {
  containers: [{
    id: 'main',
    rows: [
      [
        {
          model: 'foo',
          renderer: 'password'
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
