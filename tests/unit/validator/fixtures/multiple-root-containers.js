export default {
  version: '1.0',
  type: 'form',

  containers: [
    {
      id: 'name',
      rows: [
        [{model: 'firstName'}],
        [{model: 'lastName'}]
      ]
    },
    {
      id: 'alias',
      rows: [
        [{model: 'alias'}]
      ]
    }
  ],

  rootContainers: [
    {label: 'Name', container: 'name'},
    {label: 'Alias', container: 'alias'}
  ]
}
