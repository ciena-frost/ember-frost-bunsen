export default {
  containers: [{
    id: 'main',
    rows: [
      [
        {
          model: 'foo',
          renderer: 'button-group'
        }
      ],
      [
        {
          model: 'bar',
          renderer: 'button-group'
        }
      ],
      [
        {
          model: 'baz',
          renderer: 'button-group'
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
