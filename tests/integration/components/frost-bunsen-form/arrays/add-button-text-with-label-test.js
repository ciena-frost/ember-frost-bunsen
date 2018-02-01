import {describe, it} from 'mocha'

import {expectButtonWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / array add button text with no label', function () {
  setupFormComponentTest({
    bunsenModel: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          title: 'Full name',
          properties: {
            first: {
              type: 'string'
            },
            last: {
              type: 'string'
            }
          },
          required: [
            'first',
            'last'
          ]
        },
        addresses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              street: {
                type: 'string'
              },
              city: {
                type: 'string'
              },
              state: {
                type: 'string'
              },
              zip: {
                type: 'string'
              }
            },
            required: [
              'street',
              'city',
              'state',
              'zip'
            ]
          },
          minItems: 1
        }
      },
      required: [
        'name',
        'addresses'
      ]
    },
    bunsenView: {
      version: '2.0',
      type: 'form',
      cells: [
        {
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
              label: 'ROADM Lines',
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
  })

  it('renders as expected', function () {
    const $button = this.$(selectors.frost.button.input.enabled)

    expectButtonWithState($button, {
      icon: 'round-add',
      text: 'Add ROADM Line'
    })
  })
})
