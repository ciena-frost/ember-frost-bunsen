export default [
  {
    id: 'array-custom',
    label: 'Array (Custom)',
    modelIds: ['array'],
    view: {
      version: '1.0',
      type: 'form',
      rootContainers: [
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
          rows: [
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
                  // TODO: add back inline: false, once tab UX is addressed
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
                  inline: true,
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
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
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
          rows: [
            [
              {model: 'name.first'},
              {model: 'name.last'}
            ]
          ]
        },
        {
          id: 'addresses',
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [{label: 'Flat', container: 'flat'}],
      containers: [
        {
          id: 'networkElement',
          rows: [
            [{model: 'name'}],
            [{model: 'interfaces', container: 'interface'}]
          ]
        },

        {
          id: 'interface',
          rows: [
            [
              {model: 'name'},
              {model: 'adminState'}
            ]
          ]
        },

        {
          id: 'flat',
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      ],
      buttonLabels: {
        cancel: 'Cancel',
        submit: 'Create'
      }
    }
  },
  {
    id: 'simple-custom',
    label: 'Simple (Custom)',
    modelIds: ['simple'],
    view: {
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      ],
      buttonLabels: {
        cancel: 'Cancel',
        submit: 'Create'
      }
    }
  },
  {
    id: 'select-form',
    label: 'Select Form',
    modelIds: ['select'],
    view: {
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
            [
              {
                model: 'enumExample',
                renderer: 'select'
              }
            ],
            [
              {
                model: 'queryExample',
                renderer: 'select'
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
            [
              {
                model: 'enumExample',
                renderer: 'select'
              }
            ],
            [
              {
                model: 'queryExample',
                renderer: 'select',
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
      version: '1.0',
      type: 'detail',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
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
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          label: 'User Information',
          rows: [
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
      ],
      buttonLabels: {
        cancel: 'Cancel',
        submit: 'Create'
      }
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
          rows: [
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
          rows: [
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
          rows: [
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
          rows: [
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
            [{
              model: 'countryOfBirth',
              renderer: 'select'
            }],
            [{model: 'stateOfBirth'}]
          ]
        },
        {
          id: 'address',
          label: 'Address',
          rows: [
            [{model: 'address'}],
            [{model: 'city'}],
            [{model: 'state'}],
            [{
              model: 'country',
              renderer: 'select'
            }],
            [{model: 'zipCode'}]
          ]
        },
        {
          id: 'parents',
          rows: [
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
          rows: [
            [{model: 'firstName'}],
            [{model: 'middleName'}],
            [{model: 'lastName'}],
            [{model: 'stateOfBirth'}],
            [{
              model: 'countryOfBirth',
              renderer: 'select'
            }]
          ]
        },
        {
          id: 'mother',
          rows: [
            [{model: 'firstName'}],
            [{model: 'middleName'}],
            [{model: 'lastName'}],
            [{model: 'stateOfBirth'}],
            [{
              model: 'countryOfBirth',
              renderer: 'select'
            }]
          ]
        }
      ],
      rootContainers: [{
        label: 'Main',
        container: 'main'
      }],
      type: 'form',
      version: '1.0'
    }
  },
  {
    id: 'conditional-prop-select-form',
    label: 'Conditional With Select',
    modelIds: ['conditional-properties'],
    view: {
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'main',
          rows: [
            [
              {
                model: 'tagType',
                renderer: 'select'
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
    id: 'complex-conditional-prop-select-form',
    label: 'Complex With Select',
    modelIds: ['complex-conditional-properties'],
    view: {
      version: '1.0',
      type: 'form',
      rootContainers: [
        {
          label: 'Main',
          container: 'main'
        }
      ],
      containers: [
        {
          id: 'tags',
          rows: [
            [
              {
                model: 'tagType',
                renderer: 'select'
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
          rows: [
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
