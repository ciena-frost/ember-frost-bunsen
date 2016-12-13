import {expect} from 'chai'
import {expectOnValidationState} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {describe, it} from 'mocha'

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
      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx, {count: 1})

      expect(
        ctx.props.onChange.callCount,
        'informs consumer of change'
      )
        .to.equal(1)

      expect(
        ctx.props.onChange.lastCall.args[0],
        'applies default value from bunsen model'
      )
        .to.eql({
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
      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx, {count: 2})

      expect(
        ctx.props.onChange.callCount,
        'informs consumer of change'
      )
        .to.equal(2)

      expect(
        ctx.props.onChange.lastCall.args[0],
        'applies valueRef to form value'
      )
        .to.eql({
          baz: 'alpha',
          foo: 'alpha'
        })
    })
  })
})
