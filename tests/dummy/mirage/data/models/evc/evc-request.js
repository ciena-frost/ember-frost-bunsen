import Ember from 'ember'
const {merge} = Ember

import baseService from './base-service'

export default {
  title: 'EVC Request',
  description: 'This resource type represent an end to end L2 Service',
  properties: {
    properties: {
      type: 'object',
      properties: merge({
        routeMeta: {
          type: 'object',
          title: 'Route Meta Data',
          description: '',
          properties: {
            originator: {
              type: 'string',
              title: 'Originator',
              description: 'The name originator for the service request',
              default: 'BP2'
            }
          }
        },
        serviceType: {
          title: 'Service Type',
          type: 'string',
          description: 'Service Type',
          enum: ['EPL', 'EVPL', 'ELAN']
        },
        routeDescriptor: {
          title: 'RouteDescriptor',
          type: 'array',
          description: 'Descriptor of a route to use for EVC',
          items: {
            title: 'RouteDescriptor',
            type: 'object',
            properties: {
              layerRate: {
                title: 'Layer Rate',
                type: 'string'
              },
              ports: {
                title: 'Ports',
                type: 'array',
                items: {
                  title: 'Port',
                  type: 'string'
                }
              }
            }
          }
        },
        profiles: {
          title: 'Profiles',
          type: 'array',
          default: [],
          items: {
            '$ref': '#/definitions/profile'
          }
        },
        provisionState: {
          type: 'string',
          '$ref': '#/definitions/provisionState'
        },
        lastTransition: {
          type: 'string',
          '$ref': '#/definitions/lastTransition'
        },
        serviceState: {
          type: 'string',
          '$ref': '#/definitions/serviceState'
        }
      }, baseService.properties.properties.properties)
    }
  }
}
