/**
 * Bunsen view for a complex EVC
 */
export default {
  version: '2.0',
  type: 'form',
  cells: [
    {
      children: [
        {
          extends: 'identification'
        },
        {
          extends: 'serviceFields'
        },
        /* FIXME: commented out b/c nothing is currently being renderer in constraints cell
        {
          extends: 'constrain'
        },
        */
        {
          extends: 'routeSelection'
        }
      ],
      classNames: {
        cell: 'service'
      }
    }
  ],
  cellDefinitions: {
    empty: {
      children: []
    },
    identification: {
      children: [
        {
          classNames: {
            cell: 'half-col'
          },
          /*
          renderer: {
            name: 'product-id',
            resourceType: 'mdsolayer2.resourceTypes.EVCRequestFacade'
          },
          */
          label: 'Product ID',
          model: 'productId'
        },
        {
          extends: 'empty',
          classNames: {
            cell: 'half-col'
          }
        },
        {
          classNames: {
            cell: 'half-col service-type'
          },
          renderer: {
            name: 'select'
          },
          model: 'properties.serviceType',
          placeholder: 'Select a service type…'
        },
        {
          classNames: {
            cell: 'half-col'
          },
          model: 'properties.customerName',
          placeholder: 'Enter a customer…'
        },
        {
          renderer: {
            name: 'hidden'
          },
          model: 'properties.routeMeta.originator'
        },
        {
          renderer: {
            name: 'hidden'
          },
          model: 'properties.profiles'
        },
        {
          renderer: {
            name: 'hidden'
          },
          model: 'properties.structure'
        },
        {
          classNames: {
            cell: 'half-col name'
          },
          model: 'properties.name'
        },
        {
          classNames: {
            cell: 'half-col'
          },
          model: 'description'
        },
        {
          renderer: {
            name: 'hidden',
            valueRef: 'properties.name'
          },
          model: 'label'
        }
      ],
      collapsible: true,
      label: 'Identification'
    },
    serviceFields: {
      children: [
        {
          extends: 'aEnd',
          classNames: {
            cell: 'half-col a-end'
          }
        },
        {
          extends: 'zEnd',
          classNames: {
            cell: 'half-col z-end'
          }
        }
      ],
      classNames: {
        cell: 'service-fields-container'
      },
      collapsible: true,
      label: 'Endpoint configuration'
    },
    aEnd: {
      children: [
        {
          classNames: {
            cell: 'end-node'
          },
          renderer: {
            name: 'select'
          },
          label: 'A-End',
          model: 'properties.endpoints.0.settings.node',
          placeholder: 'Choose an A-End node…'
        },
        {
          classNames: {
            cell: 'end-port'
          },
          renderer: {
            name: 'select'
          },
          label: 'A-End Port',
          model: 'properties.endpoints.0.settings.details.0.flowSettings.0.port',
          placeholder: 'Choose an A-End port…'
        },
        {
          extends: 'flowDetails',
          classNames: {
            cell: 'no-model-container-label'
          },
          model: 'properties.endpoints.0.settings'
        }
      ],
      label: 'A-End'
    },
    zEnd: {
      children: [
        {
          classNames: {
            cell: 'end-node'
          },
          renderer: {
            name: 'select'
          },
          label: 'Z-End',
          model: 'properties.endpoints.1.settings.node',
          placeholder: 'Choose a Z-End node…'
        },
        {
          classNames: {
            cell: 'end-port'
          },
          renderer: {
            name: 'select'
          },
          label: 'Z-End Port',
          model: 'properties.endpoints.1.settings.details.0.flowSettings.0.port',
          placeholder: 'Choose a Z-End port…'
        },
        {
          extends: 'flowDetails',
          classNames: {
            cell: 'no-model-container-label'
          },
          model: 'properties.endpoints.1.settings'
        }
      ],
      label: 'Z-End'
    },
    flowDetails: {
      children: [
        {
          /*
          renderer: {
            name: 'bandwidth-profile',
            resourceType: 'mdso.resourceTypes.BandwidthProfile'
          },
          */
          label: 'Bandwidth profile',
          model: 'details.0.flowSettings.0.ingressPolicer'
        },
        {
          label: 'Filter profile',
          model: 'details.0.flowSettings.0.filter'
        },
        {
          model: 'details.0.flowSettings.0.vlanOperations',
          children: [
            {
              arrayOptions: {
                itemCell: {
                  extends: 'inner-vlan'
                }
              },
              label: 'Ingress VLAN Operations',
              model: 'ingress.0'
            },
            {
              arrayOptions: {
                itemCell: {
                  extends: 'inner-vlan'
                }
              },
              label: 'Egress VLAN Operations',
              model: 'egress.0'
            }
          ]
        }
      ],
      label: 'Flow Details'
    },
    'inner-vlan': {
      children: [
        {
          classNames: {
            cell: 'one-half'
          },
          model: 'vlan'
        },
        {
          classNames: {
            cell: 'one-half'
          },
          children: []
        },
        {
          classNames: {
            cell: 'one-half'
          },
          label: 'Tag action',
          model: 'tagAction',
          renderer: {
            name: 'select'
          }
        },
        {
          classNames: {
            cell: 'one-half'
          },
          label: 'New VLAN',
          model: 'newVlan'
        },
        {
          classNames: {
            cell: 'one-half'
          },
          label: 'Priority action',
          model: 'prioAction',
          renderer: {
            name: 'select'
          }
        },
        {
          classNames: {
            cell: 'one-half'
          },
          model: 'pcp'
        },
        {
          classNames: {
            cell: 'one-half'
          },
          label: 'TPID action',
          model: 'tpidAction',
          renderer: {
            name: 'select'
          }
        },
        {
          classNames: {
            cell: 'one-half'
          },
          model: 'tpid',
          renderer: {
            name: 'select'
          }
        }
      ]
    },
    /* FIXME: not sure why but constraints were already disabled before upgrading to v2
    constrain: {
      children: [
        {
          arrayOptions: {
            autoAdd: true,
            compact: true,
            itemCell: {
              extends: 'networkElementConstraint'
            },
            showLabel: false,
            sortable: true
          },
          label: 'by network element',
          model: 'networkElement'
        },
        {
          children: [],
          label: 'by tunnel / ERP'
        }
      ],
      collapsible: true,
      model: 'constraints',
      label: 'Constrain'
    },
    networkElementConstraint: {
      children: [
        {
          classNames: {
            cell: 'third-col'
          },
          label: ' ', // No label (empty string will trigger default label)
          model: 'networkElement',
          placeholder: 'Select network element…'
        },
        {
          classNames: {
            cell: 'third-col'
          },
          label: ' ', // No label (empty string will trigger default label)
          model: 'port',
          placeholder: 'Select port…'
        },
        {
          classNames: {
            cell: 'third-col'
          },
          label: ' ', // No label (empty string will trigger default label)
          model: 'constraintType',
          renderer: {
            name: 'button-group'
          }
        }
      ]
    },
    */
    routeSelection: {
      children: [
        {
          /*
          renderer: {
            name: 'route-selection-input'
          },
          */
          model: 'properties.routeDescriptor'
        }
      ],
      label: ''
    }
  }
}
