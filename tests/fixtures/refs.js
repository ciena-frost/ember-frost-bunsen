export default {
  definitions: {
    node: {
      type: 'object',
      properties: {
        bandwidthProfile: {
          type: 'object',
          properties: {
            cbs: {type: 'string'},
            cir: {type: 'string'},
            ebs: {type: 'string'},
            eir: {type: 'string'},
            name: {type: 'string', editable: false}
          }
        },
        description: {type: 'string', editable: false},
        egressVlanOps: {
          type: 'array',
          '$ref': '#/definitions/vlanOps'
        },
        ingressVlanOps: {
          type: 'array',
          '$ref': '#/definitions/vlanOps'
        },
        networkController: {type: 'string', editable: false},
        node: {type: 'string', editable: false},
        port: {type: 'string', editable: false},
        serviceProfile: {type: 'string', editable: false},
        vlan: {
          type: 'object',
          properties: {
            allFrames: {type: 'boolean'},
            priorityTagged: {type: 'boolean'},
            tags: {type: 'string'},
            untagged: {type: 'boolean'}
          }
        }
      }
    },
    vlan: {
      type: 'object',
      properties: {
        newVlan: {type: 'string'},
        pcp: {type: 'string'},
        priorityAction: {type: 'string'},
        tagAction: {type: 'string'},
        tpid: {type: 'string'},
        tpidAction: {type: 'string'},
        userSpecifiedVlanOperation: {type: 'string'},
        vlanOperation: {type: 'string'}
      }
    },
    vlanOps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          innerVlan: {
            type: 'object',
            '$ref': '#/definitions/vlan'
          },
          outerVlan: {
            type: 'object',
            '$ref': '#/definitions/vlan'
          }
        }
      }
    }
  },
  type: 'object',
  properties: {
    aEnd: {
      type: 'object',
      '$ref': '#/definitions/node'
    },
    adminState: {type: 'string', editable: false},
    comment: {type: 'string', editable: false},
    customer: {type: 'string', editable: false},
    id: {type: 'string', editable: false},
    lastProvStateTransition: {type: 'string', editable: false},
    name: {type: 'string', editable: false},
    networkController: {type: 'string', editable: false},
    opStateQualifier: {type: 'string', editable: false},
    originator: {type: 'string', editable: false},
    owner: {type: 'string', editable: false},
    provSource: {type: 'string', editable: false},
    provState: {type: 'string', editable: false},
    serviceId: {type: 'number', editable: false},
    serviceState: {type: 'string', editable: false},
    serviceType: {type: 'string', editable: false},
    services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          trails: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                serviceState: {type: 'string'}
              }
            }
          }
        }
      }
    },
    syncStatus: {
      type: 'object',
      properties: {
        lastSyncOutcome: {type: 'string', editable: false},
        lastSyncTime: {type: 'string', editable: false}
      }
    },
    trailType: {type: 'string', editable: false},
    userLabel: {type: 'string', editable: false},
    zEnd: {
      type: 'object',
      '$ref': '#/definitions/node'
    }
  }
}
