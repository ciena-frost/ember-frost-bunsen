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
  rootContainers: [
    {
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '1.0'
}
