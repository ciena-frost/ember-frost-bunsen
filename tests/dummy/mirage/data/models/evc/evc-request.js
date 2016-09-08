import baseService from './base-service'
import _ from 'lodash'

/**
 * EVC request specific properties from
 * https://bitbucket.ciena.com/projects/BP_SO/repos/bpo-mdso-interserver-app/browse/resources/definitions/types/tosca/resource_type_evc_request.tosca
 **/

export default _.merge({
  title: 'EVC Request',
  description: 'This resource type represent an end to end L2 Service',
  properties: {
    properties: {
      type: 'object',
      properties: {
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
      }
    }
  }
}, baseService)
