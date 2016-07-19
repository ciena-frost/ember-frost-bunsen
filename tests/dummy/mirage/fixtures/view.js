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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          classNames: {
            cell: 'test1 test2'
          },
          defaultClassName: 'cellDef1 cellDef2',
          children: [
            {
              model: 'name',
              renderer: {
                name: 'name-renderer'
              },
              classNames: {
                cell: 'testCellClass'
              }
            },
            {
              model: 'addresses',
              arrayOptions: {
                itemCell: {
                  label: 'Address',
                  renderer: {
                    name: 'AddressRenderer'
                  }
                }
              }
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        addr: {
          description: 'Where have you lived?',
          children: [
            {
              model: 'street'
            },
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
        },
        main: {
          children: [
            {
              model: 'name',
              extends: 'name'
            },
            {
              model: 'addresses',
              arrayOptions: {
                itemCell: {
                  extends: 'addr',
                  label: 'Address'
                }
              }
            }
          ]
        },
        name: {
          collapsible: true,
          description: 'Who are you?',
          children: [
            {
              model: 'first'
            },
            {
              model: 'last'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        addr: {
          children: [
            {
              model: 'street'
            },
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
        },
        main: {
          children: [
            {
              model: 'name',
              extends: 'name'
            },
            {
              model: 'addresses',
              arrayOptions: {
                itemCell: {
                  extends: 'addr',
                  label: 'Address'
                }
              }
            }
          ]
        },
        name: {
          children: [
            {
              model: 'first'
            },
            {
              model: 'last'
            }
          ]
        }
      }
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
          extends: 'name'
        },
        {
          label: 'Addresses',
          extends: 'addresses'
        }
      ],
      cellDefinitions: {
        addr: {
          children: [
            {model: 'street'},
            {model: 'city'},
            {model: 'state'},
            {model: 'zip'}
          ]
        },
        addresses: {
          children: [
            {
              model: 'addresses',
              arrayOptions: {
                itemCell: {
                  extends: 'addr',
                  label: 'Address'
                }
              }
            }
          ]
        },
        name: {
          children: [
            {model: 'name.first'},
            {model: 'name.last'}
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'info.people',
              arrayOptions: {
                autoAdd: true,
                itemCell: {
                  extends: 'person',
                  label: 'Person'
                }
              }
            }
          ]
        },
        person: {
          children: [
            {model: 'name.first'},
            {model: 'name.last'},
            {model: 'age'}
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              arrayOptions: {
                itemCell: {
                  label: 'Plaintiff',
                  extends: 'person'
                }
              },
              model: 'info.people.0'
            },
            {
              arrayOptions: {
                itemCell: {
                  label: 'Defendant',
                  extends: 'person'
                }
              },
              model: 'info.people.1'
            }
          ]
        },
        person: {
          children: [
            {model: 'name.first'},
            {model: 'name.last'},
            {model: 'age'}
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              label: "Plaintiff's Last Name",
              model: 'info.people.0.name.last'
            },
            {
              label: "Defendant's Last Name",
              model: 'info.people.1.name.last'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'info.people',
              arrayOptions: {
                itemCell: {
                  extends: 'person',
                  label: 'Person'
                },
                sortable: true
              }
            }
          ]
        },
        person: {
          children: [
            {model: 'name.first'},
            {model: 'name.last'},
            {model: 'age'}
          ]
        }
      }
    }
  },
  {
    id: 'complex',
    label: 'Complex',
    modelIds: ['complex'],
    view: {
      version: '2.0',
      type: 'form',
      cells: [{label: 'Flat', extends: 'flat'}],
      cellDefinitions: {
        flat: {
          children: [
            {model: 'network.host.name', label: 'Host name'},
            {
              model: 'network.host.interfaces',
              label: 'Host interfaces',
              arrayOptions: {
                itemCell: {
                  extends: 'interface'
                }
              }
            },
            {model: 'network.firewall.name', label: 'Firewall name'},
            {
              model: 'network.firewall.interfaces',
              label: 'Firewall Interfaces',
              arrayOptions: {
                itemCell: {
                  extends: 'interface'
                }
              }
            }
          ]
        },
        interface: {
          children: [
            {model: 'name'},
            {model: 'adminState'}
          ]
        },
        networkElement: {
          children: [
            {model: 'name'},
            {model: 'interfaces', extends: 'interface'}
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'name'
            },
            {
              model: 'email'
            },
            {
              model: 'paymentInfo',
              renderer: {
                name: 'property-chooser'
              },
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
            },
            {
              model: 'paymentInfo.routingNumber',
              dependsOn: 'paymentInfo.useEft'
            },
            {
              model: 'paymentInfo.accountNumber',
              dependsOn: 'paymentInfo.useEft'
            },
            {
              model: 'paymentInfo.creditCardNumber',
              dependsOn: 'paymentInfo.useCreditCard'
            },
            {
              label: 'CCV',
              model: 'paymentInfo.ccv',
              dependsOn: 'paymentInfo.useCreditCard'
            },
            {
              label: 'PayPal username',
              model: 'paymentInfo.payPalUsername',
              dependsOn: 'paymentInfo.usePayPal'
            },
            {
              label: 'PayPal password',
              model: 'paymentInfo.payPalPassword',
              dependsOn: 'paymentInfo.usePayPal'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'alias'
            },
            {
              model: 'firstName',
              label: 'First'
            },
            {
              model: 'lastName'
            },
            {
              model: 'onlyChild'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'firstName'
            },
            {
              model: 'lastName'
            },
            {
              model: 'alias'
            },
            {
              model: 'onlyChild',
              renderer: {
                name: 'BooleanRenderer'
              }
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'alias'
            },
            {
              model: 'firstName',
              label: 'First',
              transforms: {
                read: [
                  {from: '^Alexander$', regex: true, to: 'Alex'},
                  {from: '^Christopher$', regex: true, to: 'Chris'},
                  {from: '^Matthew$', regex: true, to: 'Matt'},
                  {from: '^Johnathan$', regex: true, to: 'John'},
                  {from: '^Samantha$', regex: true, to: 'Sam'}
                ],
                write: [
                  {from: '^Alex$', regex: true, to: 'Alexander'},
                  {from: '^Chris$', regex: true, to: 'Christopher'},
                  {from: '^Matt$', regex: true, to: 'Matthew'},
                  {from: '^John$', regex: true, to: 'Johnathan'},
                  {from: '^Sam$', regex: true, to: 'Samantha'}
                ]
              }
            },
            {
              model: 'lastName'
            },
            {
              model: 'onlyChild'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'enumExample'
            },
            {
              model: 'queryExample'
            },
            {
              model: 'multiSelectExample',
              renderer: {
                name: 'multi-select'
              }
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'enumExample'
            },
            {
              model: 'queryExample',
              transforms: {
                write: [
                  {
                    object: {
                      id: '${value}',
                      name: '${label}'
                    }
                  }
                ]
              }
            },
            {
              model: 'multiSelectExample',
              renderer: {
                name: 'multi-select'
              }
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'enumExample'
            },
            {
              model: 'queryExample'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          label: 'User Information',
          children: [
            {
              model: 'firstName'
            },
            {
              model: 'lastName'
            },
            {
              model: 'alias'
            },
            {
              model: 'onlyChild',
              renderer: {
                name: 'BooleanRenderer'
              }
            }
          ]
        }
      }
    }
  },
  {
    id: 'wedding-application-2-column',
    label: 'Two Column',
    modelIds: ['wedding-application'],
    view: {
      cellDefinitions: {
        address: {
          label: 'Address',
          children: [
            {model: 'address'},
            {model: 'city'},
            {model: 'state'},
            {model: 'country'},
            {model: 'zipCode'}
          ]
        },
        bride: {
          collapsible: true,
          children: [
            {extends: 'details'},
            {extends: 'address'},
            {extends: 'parents'}
          ]
        },
        details: {
          label: 'Details',
          children: [
            {model: 'firstName'},
            {model: 'middleName'},
            {
              label: 'Current last name',
              model: 'lastName'
            },
            {
              label: 'Last name at birth (if different)',
              model: 'lastNameAtBirth'
            },
            {model: 'dateOfBirth'},
            {model: 'countryOfBirth'},
            {model: 'stateOfBirth'}
          ]
        },
        father: {
          children: [
            {model: 'firstName'},
            {model: 'middleName'},
            {model: 'lastName'},
            {model: 'stateOfBirth'},
            {model: 'countryOfBirth'}
          ]
        },
        groom: {
          collapsible: true,
          children: [
            {extends: 'details'},
            {extends: 'address'},
            {extends: 'parents'}
          ]
        },
        main: {
          children: [
            {
              extends: 'groom',
              model: 'groom'
            },
            {
              extends: 'bride',
              model: 'bride'
            }
          ]
        },
        mother: {
          children: [
            {model: 'firstName'},
            {model: 'middleName'},
            {model: 'lastName'},
            {model: 'stateOfBirth'},
            {model: 'countryOfBirth'}
          ]
        },
        parents: {
          children: [
            {
              extends: 'father',
              model: 'father'
            },
            {
              extends: 'mother',
              model: 'mother'
            }
          ]
        }
      },
      cells: [{
        label: 'Main',
        extends: 'main'
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'tagType'
            },
            {
              model: 'tag'
            },
            {
              model: 'tag2'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'tagType'
            },
            {
              model: 'myTags.tag'
            },
            {
              model: 'myTags.tag2'
            }
          ]
        }
      }
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
          extends: 'main'
        }
      ],
      cellDefinitions: {
        main: {
          children: [
            {
              model: 'tags',
              arrayOptions: {
                itemCell: {
                  label: 'Tags',
                  extends: 'tags'
                }
              }
            }
          ]
        },
        tags: {
          children: [
            {
              model: 'tagType'
            },
            {
              model: 'tag'
            },
            {
              model: 'tag2'
            }
          ]
        }
      }
    }
  }
]
