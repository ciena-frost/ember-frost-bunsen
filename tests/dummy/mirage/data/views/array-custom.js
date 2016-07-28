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
    main: {
      classNames: {
        cell: 'test1 test2'
      },
      children: [
        {
          model: 'name',
          renderer: {
            name: 'name-renderer'
          },
          classNames: {
            cell: 'testCellClass'
          }
        },
        {
          model: 'addresses',
          arrayOptions: {
            itemCell: {
              label: 'Address',
              renderer: {
                name: 'AddressRenderer'
              }
            }
          }
        }
      ]
    }
  }
}
