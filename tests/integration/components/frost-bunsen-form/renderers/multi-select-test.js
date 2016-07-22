import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | multi-select',
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
              items: {
                enum: ['bar', 'baz'],
                type: 'string'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenView: {
          cellDefinitions: {
            main: {
              children: [
                {
                  model: 'foo',
                  renderer: {
                    name: 'multi-select'
                  }
                }
              ]
            }
          },
          cells: [
            {
              extends: 'main',
              label: 'Main'
            }
          ],
          type: 'form',
          version: '2.0'
        },
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy()
      })

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
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
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.multiSelect.input.enabled),
        'renders an enabled multi-select input'
      )
        .to.have.length(1)

      /* FIXME: re-enable once mutli-select is updated to ignore "selectedValue=undefined" (MRD - 2016-07-21)
      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
      */
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.multiSelect.input.enabled),
          'renders an enabled multi-select input'
        )
          .to.have.length(1)

        /* FIXME: re-enable once mutli-select is updated to ignore "selectedValue=undefined" (MRD - 2016-07-21)
        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
        */
      })
    })

    describe('when form disabled', function () {
      beforeEach(function () {
        this.set('disabled', true)
      })

      it('renders as expected', function () {
        /* FIXME: re-enable once mutli-select is fixed to allow changing "disabled" property (MRD - 2016-07-21)
        expect(
          this.$(selectors.frost.multiSelect.input.disabled),
          'renders a disabled multi-select input'
        )
          .to.have.length(1)
        */

        /* FIXME: re-enable once mutli-select is updated to ignore "selectedValue=undefined" (MRD - 2016-07-21)
        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)
        */
      })
    })
  }
)
