export default {
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'foo',
          renderer: {
            name: 'button-group'
          }
        },
        {
          model: 'bar',
          renderer: {
            name: 'button-group'
          }
        },
        {
          model: 'baz',
          renderer: {
            name: 'button-group'
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
