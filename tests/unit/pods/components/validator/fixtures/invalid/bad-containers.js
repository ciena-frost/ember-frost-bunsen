export default {
  version: '1.0',
  type: 'form',

  containers: [
    {
      id: 'foo',
      rows: []
    },
    {
      id: 'bar'
    }
  ],

  rootContainers: [
    {
      label: 'Foo',
      container: 'foo'
    },
    {
      label: 'Bar',
      container: 'bar'
    }
  ]
}
