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
      children: [
        {
          model: 'info.people',
          arrayOptions: {
            autoAdd: true,
            itemCell: {
              extends: 'person',
              label: 'Person'
            }
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
