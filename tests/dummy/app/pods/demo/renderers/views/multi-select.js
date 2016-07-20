export default {
  containers: [{
    id: 'main',
    rows: [
      [
        {
          model: 'foo',
          renderer: 'multi-select'
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
