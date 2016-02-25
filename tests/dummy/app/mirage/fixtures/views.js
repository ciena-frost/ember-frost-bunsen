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
                renderer: 'NameRenderer',
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
                renderer: 'PropertyChooser',
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
    id: 'l3vpn',
    label: 'L3VPN (All)',
    modelIds: ['l3vpn', 'l3vpn-defaults'],
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
                label: 'Product ID',
                model: 'productId'
              }
            ],
            [
              {
                model: 'desiredOrchState'
              }
            ],
            [
              {
                model: 'label'
              }
            ],
            [
              {
                model: 'discovered'
              }
            ],
            [
              {
                model: 'properties.name'
              }
            ],
            [
              {
                model: 'properties.description'
              }
            ],
            [
              {
                model: 'properties.customer-name'
              }
            ],
            [
              {
                model: 'properties.service.svc-bandwidth',
                label: 'Service Bandwidth'
              }
            ],
            [
              {
                model: 'properties.endpoints',
                item: {
                  container: 'endpoints'
                }
              }
            ]
          ]
        },
        {
          id: 'endpoints',
          rows: [
            [
              {
                model: 'nodeId'
              }
            ],
            [
              {
                model: 'nodeTypeGroup'
              }
            ],
            [
              {
                model: 'extension.interface',
                container: 'interface'
              }
            ],
            [
              {
                model: 'extension.vrf',
                container: 'vrf'
              }
            ],
            [
              {
                model: 'attachment',
                container: 'attachment'
              }
            ]
          ]
        },
        {
          id: 'interface',
          rows: [
            [
              {
                model: 'name'
              }
            ],
            [
              {
                model: 'dot1q'
              }
            ],
            [
              {
                model: 'second-dot1q'
              }
            ],
            [
              {
                model: 'address'
              }
            ]
          ]
        },
        {
          id: 'vrf',
          rows: [
            [
              {
                model: 'name'
              }
            ],
            [
              {
                model: 'address-family',
                item: {
                  container: 'address-family'
                }
              }
            ]
          ]
        },
        {
          id: 'address-family',
          rows: [
            [
              {
                model: 'type'
              }
            ],
            [
              {
                model: 'af.import.route-target',
                label: 'Import Route Target'
              }
            ],
            [
              {
                model: 'af.export.route-target',
                label: 'Export Route Target'
              }
            ]
          ]
        },
        {
          id: 'export',
          rows: [
            [
              {
                model: 'route-target'
              }
            ]
          ]
        },
        {
          id: 'attachment',
          rows: [
            [
              {
                model: 'connection',
                container: 'connection'
              }
            ]
          ]
        },
        {
          id: 'connection',
          rows: [
            [
              {
                model: 'ipv4.subnet-prefix',
                label: 'IPv4 Subnet Prefix'
              }
            ],
            [
              {
                model: 'routing-protocols',
                item: {
                  container: 'routing-protocols'
                }
              }
            ]
          ]
        },
        {
          id: 'routing-protocols',
          rows: [
            [
              {
                model: 'type'
              }
            ],
            [
              {
                model: 'bgp',
                container: 'bgp'
              }
            ]
          ]
        },
        {
          id: 'bgp',
          rows: [
            [
              {
                model: 'as-number'
              }
            ],
            [
              {
                model: 'address-family'
              }
            ],
            [
              {
                model: 'route-distinguisher'
              }
            ],
            [
              {
                model: 'vrf'
              }
            ]
          ]
        }
      ]
    }
  },
  {
    id: 'l3vpn-trimmed',
    label: 'L3VPN (Trimmed)',
    modelIds: ['l3vpn', 'l3vpn-defaults'],
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
                container: 'general'
              }
            ],
            [
              {
                label: 'Endpoint Configuration',
                model: 'properties.endpoints',
                item: {
                  container: 'endpoints'
                }
              }
            ]
          ]
        },
        {
          id: 'general',
          label: 'General',
          rows: [
            [
              {
                label: 'Product ID',
                model: 'productId'
              }
            ],
            [
              {
                model: 'label'
              }
            ],
            [
              {
                model: 'properties.name'
              }
            ],
            [
              {
                model: 'properties.description'
              }
            ],
            [
              {
                model: 'properties.customer-name'
              }
            ],
            [
              {
                model: 'properties.service.svc-bandwidth',
                label: 'Service Bandwidth'
              }
            ]
          ]
        },
        {
          id: 'endpoints',
          rows: [
            [
              {
                container: 'endpoint-info'
              }
            ],
            [
              {
                model: 'extension.interface',
                container: 'interface'
              }
            ],
            [
              {
                model: 'extension.vrf',
                container: 'vrf'
              }
            ],
            [
              {
                model: 'attachment',
                container: 'attachment'
              }
            ]
          ]
        },
        {
          className: 'frost-bunsen-section',
          id: 'endpoint-info',
          rows: [
            [
              {
                label: 'Node ID',
                model: 'nodeId'
              }
            ],
            [
              {
                label: 'Node type',
                model: 'nodeTypeGroup'
              }
            ]
          ]
        },
        {
          id: 'interface',
          rows: [
            [
              {
                model: 'name'
              }
            ],
            [
              {
                label: 'Dot1q',
                model: 'dot1q'
              }
            ],
            [
              {
                label: '2nd',
                model: 'second-dot1q'
              }
            ],
            [
              {
                model: 'address'
              }
            ]
          ]
        },
        {
          id: 'vrf',
          rows: [
            [
              {
                model: 'name'
              }
            ],
            [
              {
                model: 'address-family',
                item: {
                  container: 'address-family'
                }
              }
            ]
          ]
        },
        {
          id: 'address-family',
          rows: [
            [
              {
                model: 'type'
              }
            ],
            [
              {
                model: 'af.import.route-target',
                label: 'Import Route Target'
              }
            ],
            [
              {
                model: 'af.export.route-target',
                label: 'Export Route Target'
              }
            ]
          ]
        },
        {
          id: 'export',
          rows: [
            [
              {
                model: 'route-target'
              }
            ]
          ]
        },
        {
          id: 'attachment',
          rows: [
            [
              {
                model: 'connection',
                container: 'connection'
              }
            ]
          ]
        },
        {
          id: 'connection',
          rows: [
            [
              {
                model: 'ipv4.subnet-prefix',
                label: 'IPv4 Subnet Prefix'
              }
            ],
            [
              {
                model: 'routing-protocols',
                item: {
                  container: 'routing-protocols'
                }
              }
            ]
          ]
        },
        {
          id: 'routing-protocols',
          rows: [
            [
              {
                model: 'type'
              }
            ],
            [
              {
                model: 'bgp',
                container: 'bgp'
              }
            ]
          ]
        },
        {
          id: 'bgp',
          rows: [
            [
              {
                model: 'as-number'
              }
            ],
            [
              {
                model: 'address-family'
              }
            ],
            [
              {
                model: 'route-distinguisher'
              }
            ],
            [
              {
                model: 'vrf'
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
  }
]
