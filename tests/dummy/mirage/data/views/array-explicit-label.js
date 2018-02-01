export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      extends: 'main'
    }
  ],
  cellDefinitions: {
    addr: {
      children: [
        {
          model: 'street'
        },
        {
          model: 'city'
        },
        {
          model: 'state'
        },
        {
          model: 'zip'
        }
      ]
    },
    main: {
      children: [
        {
          model: 'name',
          extends: 'name'
        },
        {
          model: 'addresses',
          label: 'HOME Addresses',
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
        {
          model: 'first'
        },
        {
          model: 'last'
        }
      ]
    }
  }
}
