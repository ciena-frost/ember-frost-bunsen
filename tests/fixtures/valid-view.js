export default {
  version: '2.0',
  type: 'form',
  cellDefinitions: [
    {
      id: 'main',
      children: [
        [{extends: 'name'}],
        [{
          model: 'addresses',
          extends: 'address',
          item: {
            label: 'Addr'
          }
        }],
        [{extends: 'nameModel', model: 'name'}],
        [{
          label: 'Custom Name',
          model: 'name',
          renderer: {
            name: 'NameRenderer'
          }
        }]
      ]
    },
    {
      id: 'name',
      children: [
        [{model: 'name.first'}],
        [{model: 'name.last'}]
      ]
    },
    {
      id: 'address',
      children: [
        [{model: 'street'}],
        [{model: 'city'}, {model: 'state'}, {model: 'zip'}]
      ]
    },
    {
      id: 'nameModel',
      children: [
        [{model: 'first'}],
        [{model: 'last'}]
      ]
    }
  ],
  cells: [{label: 'Main', extends: 'main'}]
}
