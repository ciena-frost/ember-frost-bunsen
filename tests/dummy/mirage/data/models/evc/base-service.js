import Ember from 'ember'
const {merge} = Ember

import forwardingConstruct from './forwarding-construct'

export default {
  title: 'Base Service',
  description: 'Base Service definition derived from ForwardingConstruct',
  properties: {
    properties: {
      type: 'object',
      properties: merge({
        customerName: {
          description: 'Name of the customer for which this service will be provisioned.',
          type: 'string'
        },
        description: {
          type: 'string',
          title: 'Description',
          description: ''
        },
        name: {
          type: 'string',
          title: 'Name',
          description: ''
        },
        nativeName: {
          description: 'The name of the FC that is native to the network element.',
          type: 'string'
        },
        userLabel: {
          description: 'The label given to the FRE by an user.',
          type: 'string'
        },

        /**
         * operations
         **/
        opAddEndpoint: {
          title: 'Add Endpoint',
          type: 'object',
          properties: {
            endPointId: {
              type: 'string'
            },
            role: {
              type: 'string'
            }
          }
        },
        opRemoveEndpoint: {
          title: 'Remove Endpoint',
          type: 'string'
        }
      }, forwardingConstruct.properties.properties.properties)
    }
  }
}
