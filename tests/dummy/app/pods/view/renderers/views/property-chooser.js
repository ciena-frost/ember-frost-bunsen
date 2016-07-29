export default {
  cellDefinitions: {
    main: {
      children: [
        {
          model: 'foo',
          renderer: {
            choices: [
              {
                label: 'Bar',
                value: 'useBar'
              },
              {
                label: 'Baz',
                value: 'useBaz'
              }
            ],
            name: 'property-chooser'
          }
        },
        {
          dependsOn: 'foo.useBar',
          model: 'foo.name'
        },
        {
          dependsOn: 'foo.useBaz',
          model: 'foo.title'
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
