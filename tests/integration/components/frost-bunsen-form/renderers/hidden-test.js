import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | hidden',
  {
    integration: true
  },
  function () {
    describe('with default value', function () {
      let props, sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()

        props = {
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
          },
          onChange: sandbox.spy(),
          onValidation: sandbox.spy()
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          onChange=onChange
          onValidation=onValidation
        }}`)
      })

      afterEach(function () {
        sandbox.restore()
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)

        expect(
          props.onChange.callCount,
          'informs consumer of change'
        )
          .to.equal(1)

        expect(
          props.onChange.lastCall.args[0],
          'applies default value from bunsen model'
        )
          .to.eql({
            foo: 'bar'
          })
      })
    })

    describe('when valueRef is set', function () {
      let props, sandbox

      beforeEach(function (done) {
        sandbox = sinon.sandbox.create()

        props = {
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
          onChange: sandbox.spy(),
          onValidation: sandbox.spy(),
          value: {
            baz: 'alpha'
          }
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          onChange=onChange
          onValidation=onValidation
          value=value
        }}`)

        Ember.run.later(() => {
          done()
        }, 10)
      })

      afterEach(function () {
        sandbox.restore()
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(2)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)

        expect(
          props.onChange.callCount,
          'informs consumer of change'
        )
          .to.equal(2)

        expect(
          props.onChange.lastCall.args[0],
          'applies valueRef to form value'
        )
          .to.eql({
            baz: 'alpha',
            foo: 'alpha'
          })
      })
    })
  }
)
