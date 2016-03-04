export default {
  'additionalProperties': false,
  'definitions': {
    'cell': {
      'additionalProperties': false,
      'description': 'A single cell in the grid system, "model" or "container" is required',
      'properties': {
        'className': {
          'type': 'string',
          'description': 'CSS "className" for this cell'
        },
        'container': {
          'type': 'string',
          'description': 'The "id" of a container in the "containers" array'
        },
        'dependsOn': {
          'type': 'string',
          'description': 'Dotted notation reference to a property in the model that this property depends on'
        },
        'disabled': {
          'type': 'boolean',
          'description': 'True to disable the input'
        },
        'inputClassName': {
          'type': 'string',
          'description': 'CSS "className" for the input itself'
        },
        'item': {
          'additionalProperties': false,
          'type': 'object',
          'description': 'The configuration for a particular item when the parent is an array',
          'properties': {
            'className': {
              'type': 'string',
              'description': 'CSS "className" for this cell'
            },
            'container': {
              'type': 'string',
              'description': 'The "id" of a container in the "containers" array'
            },
            'inline': {
              'type': 'boolean',
              'description': 'When true, use inline item rendering instead of tabs'
            },
            'inputClassName': {
              'type': 'string',
              'description': 'CSS "className" for the input itself'
            },
            'label': {
              'type': 'string',
              'description': 'The user-visible label for this cell'
            },
            'labelClassName': {
              'type': 'string',
              'description': 'CSS "className" for the label of the input'
            },
            'placeholder': {
              'type': 'string',
              'description': 'Text to display when no value is set'
            },
            'properties': {
              'type': 'object',
              'description': 'Properties to pass to custom renderers'
            },
            'renderer': {
              'type': 'string',
              'description': 'Name of a custom renderer for the model'
            }
          }
        },
        'label': {
          'type': 'string',
          'description': 'The user-visible label for this cell'
        },
        'labelClassName': {
          'type': 'string',
          'description': 'CSS "className" for the label of the input'
        },
        'model': {
          'type': 'string',
          'description': 'Dotted notation reference to a property in the Model'
        },
        'placeholder': {
          'type': 'string',
          'description': 'Text to display when no value is set'
        },
        'properties': {
          'type': 'object',
          'description': 'Properties to pass to custom renderers'
        },
        'renderer': {
          'type': 'string',
          'description': 'Name of a custom renderer for the model'
        }
      },
      'type': 'object'
    }
  },
  'type': 'object',
  'description': 'The JSON Schema for a view definition',
  'properties': {
    'buttonLabels': {
      'type': 'object',
      'properties': {
        'cancel': {
          'type': 'string',
          'description': 'The user-visible label for the cancel button',
          'default': 'Cancel'
        },
        'submit': {
          'type': 'string',
          'description': 'The user-visible label for the submit button',
          'default': 'Submit'
        }
      }
    },
    'containers': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'className': {
            'type': 'string',
            'description': 'A CSS className for the container div itself'
          },
          'defaultClassName': {
            'type': 'string',
            'description': 'A default "className" to use on all cells that do not specify one'
          },
          'id': {
            'type': 'string',
            'description': 'A unique identifier for this container (used as a reference to it)'
          },
          'rows': {
            'type': 'array',
            'items': {
              'type': 'array',
              'description': 'A representation of a row in a grid layout, defined as an array of cells',
              'items': {
                '$ref': '#/definitions/cell'
              }
            },
            'minItems': 1
          }
        },
        'required': [
          'id',
          'rows'
        ]
      },
      'minItems': 1
    },
    'rootContainers': {
      'type': 'array',
      'description': 'Top-level entry-point containers (i.e. tabs) currently only one is allowed',
      'items': {
        'type': 'object',
        'properties': {
          'container': {
            'type': 'string',
            'description': 'The "id" of a container in the "containers" array'
          },
          'label': {
            'type': 'string',
            'description': 'User-visible label for the entry-point (i.e. tab)'
          }
        },
        'required': [
          'container',
          'label'
        ]
      },
      'minItems': 1,
      'maxItems': 1
    },
    'type': {
      'type': 'string',
      'description': 'What kind of view is this? A form that requests information, or detail that displays it?',
      'enum': [
        'form',
        'detail'
      ]
    },
    'version': {
      'type': 'string',
      'description': 'For future use',
      'enum': [
        '1.0'
      ]
    }
  },
  'required': [
    'version',
    'type',
    'rootContainers',
    'containers'
  ]
}
