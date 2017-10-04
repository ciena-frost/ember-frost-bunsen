import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenTextRendererWithState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / heterogenous array view', function () {
  // heterogenous array views is generated dynamicly from bunsen conditions. Eeach itemCell
  // matches the array index in the form value so there shouldn't be a case where where this
  // is supported without a value
  describe('with initial value', function () {
    setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            type: 'array',
            items: {
              title: 'String',
              type: 'string'
            }
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'foo',
          arrayOptions: {
            itemCell: [{
              label: 'First'
            }, {
              label: 'Second'
            }]
          }
        }]
      },
      value: {
        foo: ['red', 'blue']
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render as expected', function () {
      expectBunsenTextRendererWithState('foo.0', {
        label: 'First',
        value: 'red'
      })
      expectBunsenTextRendererWithState('foo.1', {
        label: 'Second',
        value: 'blue'
      })
    })
  })
})
