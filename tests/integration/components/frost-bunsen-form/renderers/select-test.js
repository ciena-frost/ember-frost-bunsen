import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | select',
  {
    integration: true
  },
  function () {
    let sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      sandbox.stub(Logger, 'warn', () => {})

      this.setProperties({
        bunsenModel: {
          properties: {
            foo: {
              enum: [
                'bar',
                'baz'
              ],
              type: 'string'
            }
          },
          type: 'object'
        },
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy()
      })

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        disabled=disabled
        onChange=onChange
        onValidation=onValidation
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$('.frost-bunsen-input-select'),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.select.input.enabled),
        'renders an enabled select input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.enabled),
          'renders an enabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })

    describe('when form disabled', function () {
      beforeEach(function () {
        this.set('disabled', true)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.select.input.disabled),
          'renders a disabled select input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })
    })
  }
)
