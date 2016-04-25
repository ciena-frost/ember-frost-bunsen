const expect = chai.expect
import {describe, it} from 'mocha'
import convert from 'ember-frost-bunsen/convert-schema'

const SIMPLE_MODEL = {
  'type': 'object',
  'properties': {
    'tagType': {
      'type': 'string',
      'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
    },
    'tag': {
      'type': 'number',
      'default': 20,
      'multipleOf': 1.0,
      'minimum': 0,
      'maximum': 4094,
      'conditions': [
        {
          'if': [
            {
              'tagType': {
                'equals': 'single-tagged'
              }
            },
            {
              'tagType': {
                'equals': 'double-tagged'
              }
            }

          ]
        },
        {
          'if': [{
            'tagType': {'equals': 'foo-tagged'}
          }],
          'then': {
            'default': 120,
            'minimum': 100,
            'maximum': 200
          }
        }
      ]
    },
    'tag2': {
      'type': 'number',
      'default': 3000,
      'multipleOf': 1.0,
      'minimum': 0,
      'maximum': 4094,
      'conditions': [
        {
          'if': [
            {
              'tagType': {
                'equals': 'double-tagged'
              }
            }
          ]
        }
      ]
    }
  }
}

const START_WITH_SET_PROPERTY = {
  'type': 'object',
  'properties': {
    'tagType': {
      'type': 'string',
      'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
    },
    'tag': {
      'type': 'number',
      'default': 20,
      'multipleOf': 1.0,
      'minimum': 0,
      'maximum': 4094,
      'set': true,
      'conditions': [
        {
          'if': [
            {
              'tagType': {
                'equals': 'single-tagged'
              }
            },
            {
              'tagType': {
                'equals': 'double-tagged'
              }
            }

          ]
        },
        {
          'if': [
            {
              'tagType': {
                'equals': 'foo-tagged'
              }
            }
          ],
          'then': {
            'default': 120,
            'minimum': 100,
            'maximum': 200
          }
        }
      ]
    },
    'tag2': {
      'type': 'number',
      'default': 3000,
      'multipleOf': 1.0,
      'minimum': 0,
      'maximum': 4094,
      'conditions': [
        {
          'if': [
            {
              'tagType': {
                'equals': 'double-tagged'
              }
            }
          ]
        }
      ]
    }
  }
}

const MODEL_WITH_DEEP_CONDITIONALS = {
  type: 'object',
  properties: {
    tags: SIMPLE_MODEL
  }
}


const MODEL_WITH_RELATIVE_PATHS = {
  'type': 'object',
  'properties': {
    'tagType': {
      'type': 'string',
      'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
    },
    'tags': {
      type: 'object',
      properties: {
        'tag': {
          'type': 'number',
          'default': 20,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094,
          'conditions': [
            {
              'if': [
                {
                  '../tagType': {
                    'equals': 'single-tagged'
                  }
                },
                {
                  '../tagType': {
                    'equals': 'double-tagged'
                  }
                }

              ]
            },
            {
              'if': [{
                '../tagType': {'equals': 'foo-tagged'}
              }],
              'then': {
                'default': 120,
                'minimum': 100,
                'maximum': 200
              }
            }
          ]
        },
        'tag2': {
          'type': 'number',
          'default': 3000,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094,
          'conditions': [
            {
              'if': [
                {
                  'tagType': {
                    'equals': 'double-tagged'
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
}

const MODEL_WITH_ARRAY = {
  'type': 'object',
  'properties': {
    'tags': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'tagType': {
            'type': 'string',
            'enum': ['untagged', 'single-tagged', 'double-tagged']
          },
          'tag': {
            'type': 'number',
            'default': 20,
            'multipleOf': 1.0,
            'minimum': 0,
            'maximum': 4094,
            'conditions': [
              {
                'if': [
                  {
                    'tagType': {
                      'equals': 'single-tagged'
                    }
                  },
                  {
                    'tagType': {
                      'equals': 'double-tagged'
                    }
                  }

                ]
              }
            ]
          },
          'tag2': {
            'type': 'number',
            'default': 3000,
            'multipleOf': 1.0,
            'minimum': 0,
            'maximum': 4094,
            'conditions': [
              {
                'if': [
                  {
                    'tagType': {
                      'equals': 'double-tagged'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  }
}

describe('conditionalProperties conversion', function () {
  it('spits out the same model', function () {
    const data = {}

    const newModel = convert(SIMPLE_MODEL, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        }
      }
    })
  })

  it('spits out a new model', function () {
    const data = {
      'tagType': 'single-tagged'
    }

    const newModel = convert(SIMPLE_MODEL, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        },
        'tag': {
          'type': 'number',
          'default': 20,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094
        }
      }
    })
  })

  it('spits out a new model with two things', function () {
    const data = {
      'tagType': 'double-tagged'
    }

    const newModel = convert(SIMPLE_MODEL, data)

    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        },
        'tag': {
          'type': 'number',
          'default': 20,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094
        },
        'tag2': {
          'type': 'number',
          'default': 3000,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094
        }
      }
    })
  })

  it('spits out a new model with different things', function () {
    const data = {
      'tagType': 'foo-tagged'
    }

    const newModel = convert(SIMPLE_MODEL, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        },
        'tag': {
          'type': 'number',
          'default': 120,
          'multipleOf': 1.0,
          'minimum': 100,
          'maximum': 200
        }
      }
    })
  })

  it('can default with a conditional property showing', function () {
    const data = {}

    const newModel = convert(START_WITH_SET_PROPERTY, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        },
        'tag': {
          'type': 'number',
          'default': 20,
          'multipleOf': 1.0,
          'minimum': 0,
          'maximum': 4094
        }
      }
    })
  })

  it('hides a conditional property when it is showing by default and one of its conditions is met', function () {
    const data = {
      tagType: 'single-tagged'
    }

    const newModel = convert(START_WITH_SET_PROPERTY, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        }
      }
    })
  })

  it('handles conditional properties for nested objects', function () {
    const data = {
      tags: {
        tagType: 'single-tagged'
      }
    }

    const newModel = convert(MODEL_WITH_DEEP_CONDITIONALS, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tags': {
          'type': 'object',
          'properties': {
            'tagType': {
              'type': 'string',
              'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
            },
            'tag': {
              'type': 'number',
              'default': 20,
              'multipleOf': 1.0,
              'minimum': 0,
              'maximum': 4094
            }
          }
        }
      }
    })
  })

  it('checks relative paths', function () {
    const data = {
      tagType: 'single-tagged'
    }

    const newModel = convert(MODEL_WITH_RELATIVE_PATHS, data)
    expect(newModel).to.eql({
      'type': 'object',
      'properties': {
        'tagType': {
          'type': 'string',
          'enum': ['untagged', 'single-tagged', 'double-tagged', 'foo-tagged']
        },
        'tags': {
          'type': 'object',
          'properties': {
            'tag': {
              'type': 'number',
              'default': 20,
              'multipleOf': 1.0,
              'minimum': 0,
              'maximum': 4094
            }
          }
        }
      }
    })
  })
  it('handles arrays', function () {
    const data = {
      tags: [
        {
          tagType: 'single-tagged'
        }, {
          tagType: 'double-tagged'
        }]
    }

    const newModel = convert(MODEL_WITH_ARRAY, data)
    expect(newModel).to.eql({
      'type': 'object',
      properties: {
        'tags': {
          type: 'array',
          items: {
            anyOf: [{
              'type': 'object',
              'properties': {
                'tagType': {
                  'type': 'string',
                  'enum': ['untagged', 'single-tagged', 'double-tagged']
                },
                'tag': {
                  'type': 'number',
                  'default': 20,
                  'multipleOf': 1.0,
                  'minimum': 0,
                  'maximum': 4094
                }
              }}, {
                'type': 'object',
                'properties': {
                  'tagType': {
                    'type': 'string',
                    'enum': ['untagged', 'single-tagged', 'double-tagged']
                  },
                  'tag': {
                    'type': 'number',
                    'default': 20,
                    'multipleOf': 1.0,
                    'minimum': 0,
                    'maximum': 4094
                  },
                  'tag2': {
                    'type': 'number',
                    'default': 3000,
                    'multipleOf': 1.0,
                    'minimum': 0,
                    'maximum': 4094
                  }
                }
              }]
          }
        }
      }
    })
  })
})
