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
          arrayOptions: {
            itemCell: {
              label: 'Plaintiff',
              extends: 'person'
            }
          },
          model: 'info.people.0'
        },
        {
          arrayOptions: {
            itemCell: {
              label: 'Defendant',
              extends: 'person'
            }
          },
          model: 'info.people.1'
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
