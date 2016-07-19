export default {
  containers: [{
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
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
