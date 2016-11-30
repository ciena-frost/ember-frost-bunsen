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
          model: 'enumExample'
        },
        {
          model: 'queryExample',
          transforms: {
            write: [
              {
                object: {
                  id: '${value}',
                  name: '${label}'
                }
              }
            ]
          }
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
