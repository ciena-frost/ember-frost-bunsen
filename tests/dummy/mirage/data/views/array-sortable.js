export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      extends: 'main'
    }
  ],
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'info.people',
          arrayOptions: {
            itemCell: {
              extends: 'person',
              label: 'Person'
            },
            sortable: true
          }
        }
      ]
    },
    person: {
      children: [
        {model: 'name.first'},
        {model: 'name.last'},
        {model: 'age'}
      ]
    }
  }
}
