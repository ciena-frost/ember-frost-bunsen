export default {
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'foo',
          renderer: {
            cols: 2,
            name: 'textarea',
            rows: 4
          }
        }
      ]
    }
  },
  cells: [
    {
      extends: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
