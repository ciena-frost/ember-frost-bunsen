export default {
  cells: [
    {
      children: [
        {
          collapsible: true,
          label: 'Basic',
          description: 'This is Bunsen\'s default renderer for objects',
          children: [{
            model: 'address'
          }]
        },
        {
          collapsible: true,
          label: 'Auto-Generated',
          description: 'Generates a model on the fly',
          children: [{
            model: 'userModel.fieldName'
          }, {
            model: 'userModel.fieldType'
          }, {
            model: 'dynamicObject1',
            renderer: {
              name: 'form',
              plugin: {
                name: 'autoGenerate',
                args: {
                  name: '${./userModel.fieldName}',
                  type: '${./userModel.fieldType}'
                }
              }
            }
          }]
        },
        {
          collapsible: true,
          label: 'API Driven',
          description: 'Using a user-provided plugin to fetch schemas from an API',
          children: [
            {
              model: 'schemaType'
            },
            {
              model: 'dynamicObject2',
              renderer: {
                name: 'form',
                plugin: {
                  name: 'fetch',
                  args: {
                    schemaType: '${./schemaType}'
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ],
  type: 'form',
  version: '2.0'
}
