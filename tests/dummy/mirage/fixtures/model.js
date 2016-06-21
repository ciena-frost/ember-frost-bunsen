export default [
  {
    id: 'array',
    label: 'Array',
    model: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          title: 'Full name',
          properties: {
            first: {
              type: 'string'
            },
            last: {
              type: 'string'
            }
          },
          required: ['first', 'last']
        },
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              street: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              zip: {
                type: 'string'
              }
            },
            required: ['street', 'city', 'state', 'zip']
          },
          minItems: 1
        }
      },
      required: ['name', 'addresses']
    }
  },
  {
    id: 'array-2',
    label: 'Array 2',
    model: {
      properties: {
        info: {
          properties: {
            people: {
              items: {
                properties: {
                  age: {type: 'number'},
                  name: {
                    properties: {
                      first: {type: 'string'},
                      last: {type: 'string'}
                    },
                    type: 'object'
                  }
                },
                type: 'object'
              },
              type: 'array'
            }
          },
          type: 'object'
        }
      },
      type: 'object'
    }
  },
  {
    id: 'complex',
    label: 'Complex',
    model: {
      definitions: {
        interface: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            adminState: {type: 'string'}
          },
          required: ['name', 'adminState']
        },
        element: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            interfaces: {
              type: 'array',
              items: {
                type: 'object',
                '$ref': '#/definitions/interface'
              }
            }
          },
          required: ['name', 'interfaces']
        }
      },
      type: 'object',
      properties: {
        network: {
          type: 'object',
          properties: {
            host: {
              type: 'object',
              '$ref': '#/definitions/element'
            },
            firewall: {
              type: 'object',
              '$ref': '#/definitions/element'
            }
          },
          required: ['host', 'firewall']
        }
      },
      required: ['network']
    }
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    model: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        paymentInfo: {
          type: 'object',
          properties: {
            useEft: {
              type: 'string'
            },
            useCreditCard: {
              type: 'string'
            },
            usePayPal: {
              type: 'string'
            }
          },
          dependencies: {
            useEft: {
              type: 'object',
              properties: {
                routingNumber: {
                  type: 'string'
                },
                accountNumber: {
                  type: 'string'
                }
              },
              required: ['routingNumber', 'accountNumber']
            },
            useCreditCard: {
              type: 'object',
              properties: {
                creditCardNumber: {
                  type: 'string'
                },
                ccv: {
                  type: 'string'
                }
              },
              required: ['creditCardNumber', 'ccv']
            },
            usePayPal: {
              type: 'object',
              properties: {
                payPalUsername: {
                  type: 'string'
                },
                payPalPassword: {
                  type: 'string'
                }
              },
              required: ['payPalUsername', 'payPalPassword']
            }
          }
        }
      }
    }
  },
  {
    id: 'simple',
    label: 'Simple',
    model: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        alias: {
          type: 'string',
          title: 'Nickname'
        },
        onlyChild: {
          type: 'boolean'
        },
        age: {
          type: 'number',
          title: 'Age'
        }
      },
      required: ['lastName']
    }
  },
  {
    id: 'select',
    label: 'Select',
    model: {
      type: 'object',
      properties: {
        enumExample: {
          type: 'string',
          enum: [
            'value 1',
            'value 2',
            'value 3'
          ]
        },
        queryExample: {
          type: 'string',
          modelType: 'resource',
          valueAttribute: 'id',
          labelAttribute: 'label',
          query: {
            q: 'domainId:12345'
          }
        },
        multiSelectExample: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'value 1',
              'value 2',
              'value 3'
            ]
          }
        }
      },
      required: ['enumExample']
    }
  },
  {
    id: 'simple-with-defaults',
    label: 'Simple with Defaults',
    model: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          default: 'Bruce'
        },
        lastName: {
          type: 'string',
          default: 'Wayne'
        },
        alias: {
          type: 'string',
          title: 'Nickname',
          default: 'Batman'
        },
        onlyChild: {
          type: 'boolean',
          default: true
        },
        age: {
          type: 'number',
          title: 'Age'
        }
      },
      required: ['lastName']
    }
  },
  {
    id: 'array-with-defaults',
    label: 'Array with Defaults',
    model: {
      type: 'object',
      properties: {
        superheroes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                default: 'Bruce'
              },
              lastName: {
                type: 'string',
                default: 'Wayne'
              },
              alias: {
                type: 'string',
                title: 'Nickname',
                default: 'Batman'
              }
            }
          }
        }
      }
    }
  },
  {
    id: 'conditions',
    label: 'Conditions',
    model: {
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
  },
  {
    id: 'conditional-properties',
    label: 'Conditional Properties',
    model: {
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
  },
  {
    id: 'complex-conditional-properties',
    label: 'Complex Conditionals',
    model: {
      'type': 'object',
      'properties': {
        'tags': {
          'type': 'array',
          'items': {
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
  },
  {
    id: 'wedding-application',
    label: 'Wedding Application',
    model: {
      definitions: {
        parent: {
          properties: {
            countryOfBirth: {
              labelAttribute: 'name',
              modelType: 'country',
              query: {},
              type: 'string',
              valueAttribute: 'id'
            },
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            middleName: {type: 'string'},
            stateOfBirth: {type: 'string'}
          },
          required: [
            'countryOfBirth',
            'firstName',
            'lastName'
          ],
          type: 'object'
        },
        spouse: {
          properties: {
            address: {type: 'string'},
            city: {type: 'string'},
            country: {
              labelAttribute: 'name',
              modelType: 'country',
              query: {},
              type: 'string',
              valueAttribute: 'id'
            },
            countryOfBirth: {
              labelAttribute: 'name',
              modelType: 'country',
              query: {},
              type: 'string',
              valueAttribute: 'id'
            },
            dateOfBirth: {type: 'string'},
            father: {
              '$ref': '#/definitions/parent',
              type: 'object'
            },
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            lastNameAtBirth: {type: 'string'},
            middleName: {type: 'string'},
            mother: {
              '$ref': '#/definitions/parent',
              type: 'object'
            },
            state: {type: 'string'},
            stateOfBirth: {type: 'string'},
            zipCode: {type: 'string'}
          },
          required: [
            'address',
            'city',
            'country',
            'countryOfBirth',
            'dateOfBirth',
            'firstName',
            'lastName',
            'state',
            'stateOfBirth',
            'zipCode'
          ],
          type: 'object'
        }
      },
      properties: {
        bride: {
          '$ref': '#/definitions/spouse',
          type: 'object'
        },
        groom: {
          '$ref': '#/definitions/spouse',
          type: 'object'
        }
      },
      required: [
        'bride',
        'groom'
      ],
      type: 'object'
    }
  }
]
