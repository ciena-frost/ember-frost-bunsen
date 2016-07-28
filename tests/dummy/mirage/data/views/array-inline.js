export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      label: 'Main',
      extends: 'main'
    }
  ],
  cellDefinitions: {
    addr: {
      description: 'Where have you lived?',
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
      collapsible: true,
      description: 'Who are you?',
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
