export default [
  {
    id: 'array-custom',
    label: 'Array (Custom)',
    modelIds: ['array'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          className: 'test1 test2',
          defaultClassName: 'cellDef1 cellDef2',
          children: [
            [
              {
                model: 'name',
                renderer: 'name-renderer',
                className: 'testCellClass'
              }
            ],
            [
              {
                model: 'addresses',
                item: {
                  label: 'Address',
                  renderer: 'AddressRenderer'
                }
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'array-inline',
    label: 'Array (Inline)',
    modelIds: ['array'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'name',
                container: 'name'
              }
            ],
            [
              {
                model: 'addresses',
                item: {
                  container: 'addr',
                  label: 'Address'
                }
              }
            ]
          ]
        },
        {
          collapsible: true,
          id: 'name',
          instructions: 'Who are you?',
          children: [
            [
              {
                model: 'first'
              },
              {
                model: 'last'
              }
            ]
          ]
        },
        {
          id: 'addr',
          instructions: 'Where have you lived?',
          children: [
            [
              {
                model: 'street'
              }
            ],
            [
              {
                model: 'city'
              },
              {
                model: 'state'
              },
              {
                model: 'zip'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'array',
    label: 'Array (Standard)',
    modelIds: ['array'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'name',
                container: 'name'
              }
            ],
            [
              {
                model: 'addresses',
                item: {
                  container: 'addr',
                  label: 'Address'
                }
              }
            ]
          ]
        },
        {
          id: 'name',
          children: [
            [
              {
                model: 'first'
              },
              {
                model: 'last'
              }
            ]
          ]
        },
        {
          id: 'addr',
          children: [
            [
              {
                model: 'street'
              }
            ],
            [
              {
                model: 'city'
              },
              {
                model: 'state'
              },
              {
                model: 'zip'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'array-tabs',
    label: 'Array (Tabs)',
    modelIds: ['array'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Name',
          container: 'name'
        },
        {
          label: 'Addresses',
          container: 'addresses'
        }
      ],
      containers: [
        {
          id: 'name',
          children: [
            [
              {model: 'name.first'},
              {model: 'name.last'}
            ]
          ]
        },
        {
          id: 'addresses',
          children: [
            [
              {
                model: 'addresses',
                item: {
                  container: 'addr',
                  label: 'Address'
                }
              }
            ]
          ]
        },
        {
          id: 'addr',
          children: [
            [{model: 'street'}],
            [
              {model: 'city'},
              {model: 'state'},
              {model: 'zip'}
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'array-auto-add',
    label: 'Array (Auto Add)',
    modelIds: ['array-2'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'info.people',
                item: {
                  autoAdd: true,
                  container: 'person',
                  label: 'Person'
                }
              }
            ]
          ]
        },
        {
          id: 'person',
          children: [
            [{model: 'name.first'}],
            [{model: 'name.last'}],
            [{model: 'age'}]
          ]
        }
      ]
    }
  },
  {
    id: 'array-indexed',
    label: 'Array (Indexed)',
    modelIds: ['array-2'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                item: {
                  label: 'Plaintiff',
                  container: 'person'
                },
                model: 'info.people.0'
              },
              {
                item: {
                  label: 'Defendant',
                  container: 'person'
                },
                model: 'info.people.1'
              }
            ]
          ]
        },
        {
          id: 'person',
          children: [
            [{model: 'name.first'}],
            [{model: 'name.last'}],
            [{model: 'age'}]
          ]
        }
      ]
    }
  },
  {
    id: 'array-indexed-2',
    label: 'Array (Indexed 2)',
    modelIds: ['array-2'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                label: "Plaintiff's Last Name",
                model: 'info.people.0.name.last'
              },
              {
                label: "Defendant's Last Name",
                model: 'info.people.1.name.last'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'array-sortable',
    label: 'Array (Sortable)',
    modelIds: ['array-2'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'info.people',
                item: {
                  container: 'person',
                  label: 'Person',
                  sortable: true
                }
              }
            ]
          ]
        },
        {
          id: 'person',
          children: [
            [{model: 'name.first'}],
            [{model: 'name.last'}],
            [{model: 'age'}]
          ]
        }
      ]
    }
  },
  {
    id: 'complex',
    label: 'Complex',
    modelIds: ['complex'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [{label: 'Flat', container: 'flat'}],
      containers: [
        {
          id: 'networkElement',
          children: [
            [{model: 'name'}],
            [{model: 'interfaces', container: 'interface'}]
          ]
        },

        {
          id: 'interface',
          children: [
            [
              {model: 'name'},
              {model: 'adminState'}
            ]
          ]
        },

        {
          id: 'flat',
          children: [
            [{model: 'network.host.name', label: 'Host name'}],
            [{model: 'network.host.interfaces', label: 'Host interfaces', item: {container: 'interface'}}],
            [{model: 'network.firewall.name', label: 'Firewall name'}],
            [{
              model: 'network.firewall.interfaces',
              label: 'Firewall Interfaces',
              item: {
                container: 'interface'
              }
            }]
          ]
        }
      ]
    }
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    modelIds: ['dependencies'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'name'
              }
            ],
            [
              {
                model: 'email'
              }
            ],
            [
              {
                model: 'paymentInfo',
                renderer: 'property-chooser',
                label: 'Payment Type',
                properties: {
                  choices: [
                    {
                      label: 'Electronic funds transfer',
                      value: 'useEft'
                    },
                    {
                      label: 'Credit card',
                      value: 'useCreditCard'
                    },
                    {
                      label: 'PayPal',
                      value: 'usePayPal'
                    }
                  ]
                }
              }
            ],
            [
              {
                model: 'paymentInfo.routingNumber',
                dependsOn: 'paymentInfo.useEft'
              }
            ],
            [
              {
                model: 'paymentInfo.accountNumber',
                dependsOn: 'paymentInfo.useEft'
              }
            ],
            [
              {
                model: 'paymentInfo.creditCardNumber',
                dependsOn: 'paymentInfo.useCreditCard'
              }
            ],
            [
              {
                label: 'CCV',
                model: 'paymentInfo.ccv',
                dependsOn: 'paymentInfo.useCreditCard'
              }
            ],
            [
              {
                label: 'PayPal username',
                model: 'paymentInfo.payPalUsername',
                dependsOn: 'paymentInfo.usePayPal'
              }
            ],
            [
              {
                label: 'PayPal password',
                model: 'paymentInfo.payPalPassword',
                dependsOn: 'paymentInfo.usePayPal'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'simple',
    label: 'Simple (Standard)',
    modelIds: ['simple'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'alias'
              }
            ],
            [
              {
                model: 'firstName',
                label: 'First'
              },
              {
                model: 'lastName'
              }
            ],
            [
              {
                model: 'onlyChild'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'simple-custom',
    label: 'Simple (Custom)',
    modelIds: ['simple'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'firstName'
              }
            ],
            [
              {
                model: 'lastName'
              }
            ],
            [
              {
                model: 'alias'
              }
            ],
            [
              {
                model: 'onlyChild',
                renderer: 'BooleanRenderer'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'simple-transforms',
    label: 'Simple (Transforms)',
    modelIds: ['simple'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'alias'
              }
            ],
            [
              {
                model: 'firstName',
                label: 'First',
                readTransforms: [
                  {from: '^Alexander$', regex: true, to: 'Alex'},
                  {from: '^Christopher$', regex: true, to: 'Chris'},
                  {from: '^Matthew$', regex: true, to: 'Matt'},
                  {from: '^Johnathan$', regex: true, to: 'John'},
                  {from: '^Samantha$', regex: true, to: 'Sam'}
                ],
                writeTransforms: [
                  {from: '^Alex$', regex: true, to: 'Alexander'},
                  {from: '^Chris$', regex: true, to: 'Christopher'},
                  {from: '^Matt$', regex: true, to: 'Matthew'},
                  {from: '^John$', regex: true, to: 'Johnathan'},
                  {from: '^Sam$', regex: true, to: 'Samantha'}
                ]
              },
              {
                model: 'lastName'
              }
            ],
            [
              {
                model: 'onlyChild'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'select-form',
    label: 'Select Form',
    modelIds: ['select'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'enumExample'
              }
            ],
            [
              {
                model: 'queryExample'
              }
            ],
            [
              {
                model: 'multiSelectExample',
                renderer: 'multi-select'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'select-form-transforms',
    label: 'Select Form (Tranforms)',
    modelIds: ['select'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'enumExample'
              }
            ],
            [
              {
                model: 'queryExample',
                writeTransforms: [
                  {
                    object: {
                      id: '${value}',
                      name: '${label}'
                    }
                  }
                ]
              }
            ],
            [
              {
                model: 'multiSelectExample',
                renderer: 'multi-select'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'select-detail',
    label: 'Select Detail',
    modelIds: ['select'],
    view: {
      version: '2.0',
      type: 'detail',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'enumExample'
              }
            ],
            [
              {
                model: 'queryExample'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'simple-grouping',
    label: 'Simple (Grouping)',
    modelIds: ['simple'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          label: 'User Information',
          children: [
            [
              {
                model: 'firstName'
              }
            ],
            [
              {
                model: 'lastName'
              }
            ],
            [
              {
                model: 'alias'
              }
            ],
            [
              {
                model: 'onlyChild',
                renderer: 'BooleanRenderer'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'wedding-application-2-column',
    label: 'Two Column',
    modelIds: ['wedding-application'],
    view: {
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                container: 'groom',
                model: 'groom'
              },
              {
                container: 'bride',
                model: 'bride'
              }
            ]
          ]
        },
        {
          collapsible: true,
          id: 'groom',
          children: [
            [
              {container: 'details'},
              {container: 'address'}
            ],
            [{container: 'parents'}]
          ]
        },
        {
          collapsible: true,
          id: 'bride',
          children: [
            [
              {container: 'details'},
              {container: 'address'}
            ],
            [{container: 'parents'}]
          ]
        },
        {
          id: 'details',
          label: 'Details',
          children: [
            [{model: 'firstName'}],
            [{model: 'middleName'}],
            [{
              label: 'Current last name',
              model: 'lastName'
            }],
            [{
              label: 'Last name at birth (if different)',
              model: 'lastNameAtBirth'
            }],
            [{model: 'dateOfBirth'}],
            [{model: 'countryOfBirth'}],
            [{model: 'stateOfBirth'}]
          ]
        },
        {
          id: 'address',
          label: 'Address',
          children: [
            [{model: 'address'}],
            [{model: 'city'}],
            [{model: 'state'}],
            [{model: 'country'}],
            [{model: 'zipCode'}]
          ]
        },
        {
          id: 'parents',
          children: [
            [
              {
                container: 'father',
                model: 'father'
              },
              {
                container: 'mother',
                model: 'mother'
              }
            ]
          ]
        },
        {
          id: 'father',
          children: [
            [{model: 'firstName'}],
            [{model: 'middleName'}],
            [{model: 'lastName'}],
            [{model: 'stateOfBirth'}],
            [{model: 'countryOfBirth'}]
          ]
        },
        {
          id: 'mother',
          children: [
            [{model: 'firstName'}],
            [{model: 'middleName'}],
            [{model: 'lastName'}],
            [{model: 'stateOfBirth'}],
            [{model: 'countryOfBirth'}]
          ]
        }
      ],
      cells: [{
        label: 'Main',
        container: 'main'
      }],
      type: 'form',
      version: '2.0'
    }
  },
  {
    id: 'conditional-prop-select-form',
    label: 'Conditional Props',
    modelIds: ['conditional-properties'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'tagType'
              }
            ],
            [
              {
                model: 'tag'
              }
            ],
            [
              {
                model: 'tag2'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'nested-conditionals-form',
    label: 'Nested Conditions',
    modelIds: ['conditions-in-definitions', 'conditions'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          children: [
            [
              {
                model: 'tagType'
              }
            ],
            [
              {
                model: 'myTags.tag'
              }
            ],
            [
              {
                model: 'myTags.tag2'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'complex-conditional-prop-select-form',
    label: 'Complex With Select',
    modelIds: ['complex-conditional-properties'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'tags',
          children: [
            [
              {
                model: 'tagType'
              }
            ],
            [
              {
                model: 'tag'
              }
            ],
            [
              {
                model: 'tag2'
              }
            ]
          ]
        },
        {
          id: 'main',
          children: [
            [
              {
                model: 'tags',
                item: {
                  label: 'Tags',
                  container: 'tags'
                }
              }
            ]
          ]
        }
      ]
    }
  }
]
