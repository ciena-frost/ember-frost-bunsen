export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      label: 'Name',
      extends: 'name'
    },
    {
      label: 'Addresses',
      extends: 'addresses'
    }
  ],
  cellDefinitions: {
    addr: {
      children: [
        {model: 'street'},
        {model: 'city'},
        {model: 'state'},
        {model: 'zip'}
      ]
    },
    addresses: {
      children: [
        {
          model: 'addresses',
          arrayOptions: {
            itemCell: {
              extends: 'addr',
              label: 'Address'
            }
          }
        }
      ]
    },
    name: {
      children: [
        {model: 'name.first'},
        {model: 'name.last'}
      ]
    }
  }
}
