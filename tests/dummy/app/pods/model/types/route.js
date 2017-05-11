import Ember from 'ember'
const {Route} = Ember

export default Route.extend({
  model () {
    return {
      types: [
        {
          description: `
An *array* property must be a JSON array where the items in the array match the format
defined by the \`items\` property of the properties model definition. By default this
will be rendered in a form with a button to add an item as well as a remove button for
each item. Individual items will be rendered based on their corresponding types.
          `,
          example: {
            items: {
              type: 'string'
            },
            type: 'array'
          },
          name: 'array'
        },
        {
          description: `
A *boolean* property must be a JSON boolean. By default this will be rendered as a
checkbox in a form.
          `,
          example: {
            type: 'boolean'
          },
          name: 'boolean'
        },
        {
          description: `
An *integeter* property must be a JSON number without a decimal. By defaylt this will
be rendered as a numeric input in a form.
          `,
          example: {
            type: 'integer'
          },
          name: 'integer'
        },
        {
          description: `
A *number* property must be a JSON number with or without a decimal. By defaylt this
will be rendered as a numeric input in a form.
          `,
          example: {
            type: 'number'
          },
          name: 'number'
        },
        {
          description: `
An *object* property must be a JSON object that matches the format defined by the
\`properties\` property of the properties model definition. By default this properties
sub-properties will be rendered in a form (it only renders DOM inputs
for the primitive types: *boolean*, *integer*, *number*, and *string*).
          `,
          example: {
            properties: {
              foo: {
                type: 'string'
              }
            },
            type: 'object'
          },
          name: 'object'
        },
        {
          description: `
A *string* property must be a JSON string. By default this will be rendered as a
text input in a form.
          `,
          example: {
            type: 'string'
          },
          name: 'string'
        }
      ]
    }
  }
})
