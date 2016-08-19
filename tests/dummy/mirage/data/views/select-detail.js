export default {
  version: '2.0',
  type: 'detail',
  cells: [
    {
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
