export default {
  version: '1.0',
  type: 'form',

  containers: [
    {
      id: 'main',
      rows: [
        [{model: 'firstName'}],
        [{model: 'lastName'}],
        [{model: 'alias'}]
      ]
    }
  ],

  rootContainers: [{label: 'Main', container: 'main'}]
}
