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
        }
      },
      required: ['enumExample']
    }
  }
]
