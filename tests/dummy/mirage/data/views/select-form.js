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
          model: 'enumExample'
        },
        {
          model: 'queryExample'
        },
        {
          model: 'multiSelectExample',
          renderer: {
            name: 'multi-select'
          }
        }
      ]
    }
  }
}
