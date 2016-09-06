/**
 * Bunsen model for a complex EVC
 */
import _ from 'lodash'
import request from './evc-request'
import propertyTypes from './property-types'

export default _.merge({
  type: 'object',
  required: ['label', 'properties'],
  properties: {
    autoClean: {
      default: true,
      type: 'boolean'
    },
    createdAt: {type: 'string'},
    desiredOrchState: {
      default: 'active',
      type: 'string'
    },
    discovered: {
      default: false,
      type: 'boolean'
    },
    id: {type: 'string'},
    label: {type: 'string'},
    orchState: {type: 'string'},
    productId: {type: 'string'},
    description: {type: 'string'},
    reason: {type: 'string'},
    resourceTypeId: {type: 'string'},
    shared: {type: 'boolean'},
    tenantId: {type: 'string'},
    updatedAt: {type: 'string'},
    properties: {
      type: 'object',
      required: ['name', 'serviceType'],
      properties: {
        operations: {
          type: 'object',
          properties: {
            opProvisionService: {
              title: 'Provision Service',
              type: 'object',
              properties: {
                requestedProvState: {
                  type: 'string',
                  '$ref': '#/definitions/provisionState'
                },
                force: {
                  title: 'Force',
                  type: 'boolean'
                }
              }
            }
          }
        },
        endpoints: {
          type: 'array',
          default: [
            {
              settings: {
                'role': 'A_UNI',
                details: [
                  {
                    flowSettings: [
                      {
                        profiles: [
                          {
                            profileType: 'bandwidth',
                            profileName: 'custom'
                          },
                          {
                            profileType: 'filter',
                            profileName: 'VLAN'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            },
            {
              settings: {
                'role': 'Z_UNI',
                details: [
                  {
                    flowSettings: [
                      {
                        profiles: [
                          {
                            profileType: 'bandwidth',
                            profileName: 'custom'
                          },
                          {
                            profileType: 'filter',
                            profileName: 'VLAN'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          items: {
            type: 'object',
            properties: {
              endpointId: {
                title: 'Endpoint ID (UUID)',
                type: 'string'
              },
              settings: {
                type: 'object',
                '$ref': '#/definitions/l2Termination'
              }
            }
          }
        }
      }
    }
  },
  definitions: propertyTypes
}, request)
