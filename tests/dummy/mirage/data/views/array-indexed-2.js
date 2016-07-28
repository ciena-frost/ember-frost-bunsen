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
          label: "Plaintiff's Last Name",
          model: 'info.people.0.name.last'
        },
        {
          label: "Defendant's Last Name",
          model: 'info.people.1.name.last'
        }
      ]
    }
  }
}
