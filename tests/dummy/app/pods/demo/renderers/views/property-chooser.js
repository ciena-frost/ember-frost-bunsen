export default {
  containers: [{
    id: 'main',
    children: [
      [
        {
          model: 'foo',
          properties: {
            choices: [
              {
                label: 'Bar',
                value: 'useBar'
              },
              {
                label: 'Baz',
                value: 'useBaz'
              }
            ]
          },
          renderer: 'property-chooser'
        }
      ],
      [
        {
          dependsOn: 'foo.useBar',
          model: 'foo.name'
        }
      ],
      [
        {
          dependsOn: 'foo.useBaz',
          model: 'foo.title'
        }
      ]
    ]
  }],
  cells: [
    {
      container: 'main',
      label: 'Main'
    }
  ],
  type: 'form',
  version: '2.0'
}
