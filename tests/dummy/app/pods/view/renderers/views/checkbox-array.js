export default {
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'severity',
          renderer: {
            name: 'checkbox-array'
          }
        }
      ]
    }
  },
  cells: [
    {
      extends: 'main'
    }
  ],
  type: 'form',
  version: '2.0'
}
