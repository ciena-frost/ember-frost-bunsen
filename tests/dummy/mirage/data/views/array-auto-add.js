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
            compact: true,
            autoAdd: true,
            itemCell: {
              extends: 'person'
            },
            showLabel: false
          }
        }
      ]
    },
    person: {
      children: [
        {
          hideLabel: true,
          model: 'name.first',
          placeholder: 'First name'
        },
        {
          hideLabel: true,
          model: 'name.last',
          placeholder: 'Last name'
        },
        {
          hideLabel: true,
          model: 'age',
          placeholder: 'Age'
        }
      ]
    }
  }
}
