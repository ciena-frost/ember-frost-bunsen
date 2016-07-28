export default {
  version: '2.0',
  type: 'detail',
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
        }
      ]
    }
  }
}
