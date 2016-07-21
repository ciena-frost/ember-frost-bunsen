import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | number',
  {
    integration: true
  },
  function () {
    let sandbox

    ;[
      'integer',
      'number'
    ]
      .forEach((propertyType) => {
        describe(`when property type is ${propertyType}`, function () {
          let props

          beforeEach(function () {
            sandbox = sinon.sandbox.create()
            sandbox.stub(Logger, 'warn', () => {})

            props = {
              bunsenModel: {
                properties: {
                  foo: {
                    type: propertyType
                  }
                },
                type: 'object'
              },
              disabled: undefined,
              onChange: sandbox.spy(),
              onValidation: sandbox.spy()
            }

            this.setProperties(props)

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
              this.$(selectors.bunsen.renderer.number),
              'renders a bunsen number input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.number.input.enabled),
              'renders an enabled number input'
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
                this.$(selectors.frost.number.input.enabled),
                'renders an enabled number input'
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
                this.$(selectors.frost.number.input.disabled),
                'renders a disabled number input'
              )
                .to.have.length(1)

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
            })
          })

          describe('when user inputs integer', function () {
            const input = 123

            beforeEach(function () {
              props.onValidation = sandbox.spy()
              this.set('onValidation', props.onValidation)

              this.$(selectors.frost.number.input.enabled)
                .val(`${input}`)
                .trigger('input')
            })

            it('functions as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.frost.number.input.enabled),
                'renders an enabled number input'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.frost.number.input.enabled).val(),
                'input maintains user input value'
              )
                .to.equal(`${input}`)

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)

              expect(
                props.onChange.lastCall.args[0],
                'informs consumer of change'
              )
                .to.eql({
                  foo: input
                })

              expect(
                props.onValidation.callCount,
                'does not provide consumer with validation results via onValidation() property'
              )
                .to.equal(0)
            })
          })
        })
      })
  }
)
