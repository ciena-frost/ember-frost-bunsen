import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenTextRendererWithState,
  expectOnChangeState,
  expectOnValidationState,
  fillInBunsenTextRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / form', function () {
  let ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        name: {
          type: 'object',
          properties: {
            first: {
              title: 'First Name',
              type: 'string'
            },
            last: {
              title: 'Last Name',
              type: 'string'
            }
          }
        }
      },
      type: 'object'
    },
    bunsenView: {
      type: 'form',
      version: '2.0',
      cells: [{
        model: 'name'
      }]
    }
  })

  beforeEach(function () {
    return wait()
  })

  it('should render', function () {
    expectBunsenTextRendererWithState('name.first', {label: 'First Name'})
    expectBunsenTextRendererWithState('name.last', {label: 'Last Name'})
  })

  describe('when user inputs value', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()
      fillInBunsenTextRenderer('name.first', 'Clark')
      return wait()
    })

    it('functions as expected', function () {
      expectBunsenTextRendererWithState('name.first', {
        label: 'First Name',
        value: 'Clark'
      })
      expectOnChangeState(ctx, {
        name: {
          first: 'Clark'
        }
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })
})
