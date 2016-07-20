export default {
  containers: [{
    id: 'main',
    rows: [
      [
        {
          model: 'foo',
          renderer: 'select'
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
