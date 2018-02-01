import {expect} from 'chai'
import {describe, it} from 'mocha'

import {expectButtonWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe(
  'Integration: Component / frost-bunsen-form / array Title and "Add" button text with "network elements" label',
  function () {
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
                label: 'network elements',
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
      const $headings = this.$(selectors.bunsen.section.heading)

      expect(
        $headings.eq(0).text().trim(),
        'renders expected section heading'
      ).to.equal('Network elements')

      expectButtonWithState($button, {
        icon: 'round-add',
        text: 'Add network element'
      })
    })
  }
)

describe(
  'Integration: Component / frost-bunsen-form / array Title and "Add" button text with "IP addresses" label',
  function () {
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
                label: 'IP addresses',
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
      const $headings = this.$(selectors.bunsen.section.heading)

      expect(
        $headings.eq(0).text().trim(),
        'renders expected section heading'
      ).to.equal('IP addresses')

      expectButtonWithState($button, {
        icon: 'round-add',
        text: 'Add IP address'
      })
    })
  }
)