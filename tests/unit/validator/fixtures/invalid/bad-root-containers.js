export default {
  version: '1.0',
  type: 'form',

  containers: [
    {
      id: 'foo',
      rows: [[]]
    },
    {
      id: 'bar',
      rows: [[]]
    }
  ],

  rootContainers: [
    {
      label: 'Foo',
      container: 'foo'
    },
    {
      container: 'bar'
    },
    {
      label: 'Baz',
      container: 'baz'
    }
  ]
}
