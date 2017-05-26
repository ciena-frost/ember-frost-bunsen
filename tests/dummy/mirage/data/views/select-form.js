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
          label: 'Select w/ static data',
          model: 'enumExample',
          renderer: {
            name: 'select',
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }],
              none: {
                label: 'None',
                value: '',
                present: true
              }
            }
          }
        },
        {
          model: 'queryExample'
        },
        {
          label: 'Select query w/ static data',
          model: 'queryExample',
          renderer: {
            name: 'select',
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }],
              none: {
                label: 'None',
                value: 'none',
                present: true
              }
            }
          }
        },
        {
          label: 'Select query w/ local filtering',
          model: 'queryExample',
          renderer: {
            name: 'select',
            options: {
              localFiltering: true
            }
          }
        },
        {
          model: 'multiSelectExample',
          renderer: {
            name: 'multi-select'
          }
        },
        {
          label: 'Multi Select selected items test',
          model: 'queryExample',
          renderer: {
            name: 'multi-select',
            options: {
              queryForCurrentValue: true
            }
          }
        }
      ]
    }
  }
}
