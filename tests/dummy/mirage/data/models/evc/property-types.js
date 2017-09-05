export default {
  evcFilter: {
    title: 'EVC Filter',
    type: 'object',
    properties: {
      innerVlanId: {
        title: 'Inner VLAN ID',
        type: 'array',
        items: {
          type: 'number'
        }
      },
      innerVlanPriority: {
        title: 'Inner VLAN Priority',
        type: 'array',
        optional: true,
        items: {
          type: 'number'
        }
      },
      innerVLANEthertype: {
        title: 'Inner VLAN Ethertype',
        type: 'string',
        optional: true,
        enum: ['8100', '88A8', '88E7', '9100', '9101']
      },
      innerVLANCFIDEI: {
        title: 'Inner VLAN CFE/DEI',
        type: 'number',
        optional: true
      },
      dscp: {
        title: 'DSCP',
        type: 'array',
        optional: true,
        items: {
          type: 'number'
        }
      },
      outerVlanId: {
        title: 'Outer VLAN Id',
        type: 'array',
        optional: true,
        items: {
          type: 'number'
        }
      },
      outerVlanPriority: {
        title: 'Outer VLAN Priority',
        type: 'array',
        optional: true,
        items: {
          type: 'number'
        }
      },
      outerVLANEthertype: {
        title: 'Outer VLAN Ethertype',
        type: 'string',
        optional: true,
        enum: ['8100', '88A8', '88E7', '9100', '9101']
      },
      outerVLANCFIDEI: {
        title: 'outer VLAN CFE/DEI',
        type: 'number',
        optional: true
      },
      l2MACDestinationMask: {
        title: 'L2 MAC Destination Mask',
        type: 'string',
        optional: true
      },
      l2MACSourceMask: {
        title: 'L2 MAC Source Mask',
        type: 'string',
        optional: true
      },
      l2EtherType: {
        title: 'L2 Ethertype',
        type: 'string',
        optional: true,
        enum: ['CVLAN', 'SVLAN', 'BOTH']
      }
    }
  },
  lastTransition: {
    type: 'string',
    title: 'Last Tr ansition',
    description: 'Outcome of last provisioning transition',
    enum: ['TRANSITION_NONE', 'TRANSITION_INPROGRESS', 'TRANSITION_SUCCEEDED', 'TRANSITION_FAILED'],
    default: 'TRANSITION_NONE'
  },
  l2Termination: {
    type: 'object',
    required: ['node', 'role'],
    properties: {
      node: {
        type: 'string',
        description: 'UNI Node',
        modelType: 'node',
        labelAttribute: 'name',
        valueAttribute: 'id',
        editable: false
      },
      role: {
        title: 'Role',
        type: 'string',
        description: 'UNI Designation',
        enum: ['A_UNI', 'Z_UNI', 'ELAN_UNI', 'ENNI', 'INNI']
      },
      id: {
        title: 'L2 Endpoint Id',
        type: 'string',
        description: 'Layer 2 endpoint Id',
        optional: true
      },
      oamEnabled: {
        title: 'OAM Enabled',
        type: 'boolean',
        description: 'Indicates whether OAM is enabled for this endpoint',
        optional: true
      },
      mepId: {
        title: 'MEP Id',
        type: 'number',
        description: 'Allocated MEP Identifier',
        optional: true
      },
      details: {
        title: 'Details',
        type: 'array',
        description: 'Endpoint Details',
        required: ['flowSettings'],
        items: {
          title: 'Endpoint Details',
          type: 'object',
          properties: {
            flowSettings: {
              title: 'FlowSettings',
              type: 'array',
              description: 'Flow Settings',
              required: ['port'],
              items: {
                title: 'FlowSetting',
                type: 'object',
                properties: {
                  port: {
                    title: 'Port',
                    type: 'string',
                    description: 'L2 port',
                    modelType: 'port-available',
                    labelAttribute: 'attributes.name',
                    valueAttribute: 'id',
                    editable: false,
                    query: {
                      nodeId: '${../../../../node}',
                      serviceType: '${../../../../../../../serviceType}'
                    }
                  },
                  profiles: {
                    title: 'Profiles',
                    type: 'array',
                    description: 'Profiles assigned to this flow',
                    items: {
                      '$ref': '#/definitions/profile'
                    }
                  },
                  filter: {
                    title: 'Filter',
                    description: 'Filter Settings',
                    '$ref': '#/definitions/evcFilter',
                    conditions: [
                      {
                        if: [
                          {'../../../../../../../serviceType': {
                            equals: 'EVPL'
                          }}
                        ]
                      }
                    ]
                  },
                  ingressPolicer: {
                    title: 'IngressPolicer',
                    description: 'Ingress policer for UNI port',
                    '$ref': '#/definitions/policer'
                  },
                  vlanOperations: {
                    title: 'VLANOperations',
                    description: 'VLAN Operations',
                    type: 'object',
                    optional: true,
                    properties: {
                      ingress: {
                        title: 'Ingress',
                        description: 'Ingress Operations',
                        type: 'array',
                        optional: true,
                        items: {
                          type: 'array',
                          title: 'Ingress',
                          description: 'VLAN operation entry',
                          items: {
                            type: 'object',
                            '$ref': '#/definitions/vLanOperationEntry'
                          }
                        }
                      },
                      egress: {
                        title: 'Egress',
                        description: 'Egress Operations',
                        type: 'array',
                        optional: true,
                        items: {
                          type: 'array',
                          title: 'Egress',
                          description: 'VLAN operation entry',
                          items: {
                            type: 'object',
                            '$ref': '#/definitions/vLanOperationEntry'
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  profile: {
    title: 'Profile',
    type: 'object',
    description: 'A Generic descriptor for profile',
    required: ['profileType', 'profileName'],
    properties: {
      profileType: {
        title: 'Profile Type',
        type: 'string',
        description: 'Indicates the type of profile'
      },
      profileName: {
        title: 'Profile Name',
        type: 'string',
        description: 'The name of the profile'
      }
    }
  },
  vLanOperationEntry: {
    title: 'Operation',
    type: 'object',
    description: 'VLAN Operation',
    properties: {
      vlan: {
        title: 'VLAN',
        type: 'number',
        description: ''
      },
      tagAction: {
        title: 'TagAction',
        type: 'string',
        description: '',
        enum: ['PUSH', 'POP', 'SWAP', 'KEEP']
      },
      newVlan: {
        title: 'NewVlan',
        type: 'number',
        description: ''
      },
      prioAction: {
        title: 'PrioAction',
        type: 'string',
        description: '',
        enum: ['KEEP', 'SWAP', 'COPY', 'SET']
      },
      pcp: {
        title: 'PCP',
        type: 'number',
        description: ''
      },
      tpidAction: {
        title: 'TpidAction',
        type: 'string',
        description: '',
        enum: ['KEEP', 'SWAP', 'COPY', 'SET']
      },
      tpid: {
        title: 'TPID',
        type: 'string',
        description: '',
        enum: ['8100', '88A8', '88E7', '9100', '9101']
      }
    }
  },
  policer: {
    title: 'Policer',
    description: 'L2 Policer',
    type: 'object',
    optional: true,
    properties: {
      cir: {
        title: 'CIR',
        description: '',
        type: 'number',
        default: 0
      },
      cbs: {
        title: 'CBS',
        description: '',
        type: 'number',
        default: 0
      },
      eir: {
        title: 'EIR',
        description: '',
        type: 'number',
        default: 0
      },
      ebs: {
        title: 'EBS',
        description: '',
        type: 'number',
        default: 0
      },
      colorAware: {
        title: 'Color Aware',
        description: '',
        type: 'boolean',
        default: false,
        optional: true
      },
      couplingFlag: {
        title: 'Coupling Flag',
        description: '',
        type: 'boolean',
        optional: true
      },
      cirMax: {
        title: 'CIR Max',
        description: '',
        type: 'number',
        optional: true
      },
      eirMax: {
        title: 'CIR Max',
        description: '',
        type: 'number',
        optional: true
      },
      envelopeRank: {
        title: 'Envelope Rank',
        description: '',
        type: 'string',
        optional: true
      },
      envelopeCouplingFlag: {
        title: 'Envelope Coupling Flag',
        description: '',
        type: 'boolean',
        optional: true
      },
      flowBundleId: {
        title: 'Flow Bundle Id',
        description: '',
        type: 'string',
        optional: true
      }
    }
  },
  provisionState: {
    type: 'string',
    title: 'Provision State',
    description: 'The provisioned state of the trail',
    enum: ['ROUTED', 'PROVISIONING', 'PROVISIONED', 'DEPROVISIONING']
  },
  serviceState: {
    description: 'Service State',
    title: 'Service State',
    type: 'string',
    enum: ['IN_SERVICE', 'OUT_OF_SERVICE', 'OUT_OF_SERVICE_BY_MAINTENANCE', 'SERV_NA']
  }
}
