export default {
  version: '2.0',
  type: 'form',
  cellDefinitions: {
    address: {
      children: [
        {model: 'street'},
        {model: 'city'}, {model: 'state'}, {model: 'zip'}
      ]
    },
    main: {
      children: [
        {extends: 'name'},
        {
          model: 'addresses',
          extends: 'address',
          arrayOptions: {
            itemCell: {
              label: 'Addr'
            }
          }
        },
        {extends: 'nameModel', model: 'name'},
        {
          label: 'Custom Name',
          model: 'name',
          renderer: {
            name: 'NameRenderer'
          }
        }
      ]
    },
    name: {
      children: [
        {model: 'name.first'},
        {model: 'name.last'}
      ]
    },
    nameModel: {
      children: [
        {model: 'first'},
        {model: 'last'}
      ]
    }
  },
  cells: [{label: 'Main', extends: 'main'}]
}
