export default {
  version: '1.0',
  type: 'form',
  containers: [
    {
      id: 'main',
      rows: [
        [{container: 'name'}],
        [{
          model: 'addresses',
          container: 'address',
          item: {
            label: 'Addr'
          }
        }],
        [{container: 'nameModel', model: 'name'}],
        [{model: 'name', renderer: 'NameRenderer', label: 'Custom Name'}]
      ]
    },
    {
      id: 'name',
      rows: [
        [{model: 'name.first'}],
        [{model: 'name.last'}]
      ]
    },
    {
      id: 'address',
      rows: [
        [{model: 'street'}],
        [{model: 'city'}, {model: 'state'}, {model: 'zip'}]
      ]
    },
    {
      id: 'nameModel',
      rows: [
        [{model: 'first'}],
        [{model: 'last'}]
      ]
    }
  ],
  rootContainers: [{label: 'Main', container: 'main'}]
}
