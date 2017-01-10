import {describe, it} from 'mocha'

import {
  expectOnChangeState,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / hidden', function () {
  describe('with default value', function () {
    const ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            default: 'bar',
            type: 'string'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'hidden'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      }
    })

    it('renders as expected', function () {
      expectOnValidationState(ctx, {count: 1})
      expectOnChangeState(ctx, {
        foo: 'bar'
      })
    })
  })

  describe('when valueRef is set', function () {
    const ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          baz: {
            type: 'string'
          },
          foo: {
            type: 'string'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'hidden',
              valueRef: 'baz'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      },
      value: {
        baz: 'alpha'
      }
    })

    it('renders as expected', function () {
      expectOnValidationState(ctx, {count: 2})
      expectOnChangeState(ctx, {
        baz: 'alpha',
        foo: 'alpha'
      })
    })
  })
})
