import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import {expectBunsenInputToHaveError} from 'dummy/tests/helpers/ember-frost-bunsen'
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

            props = {
              bunsenModel: {
                properties: {
                  foo: {
                    type: propertyType
                  }
                },
                type: 'object'
              },
              bunsenView: undefined,
              disabled: undefined,
              onChange: sandbox.spy(),
              onValidation: sandbox.spy(),
              showAllErrors: undefined
            }

            this.setProperties(props)

            this.render(hbs`{{frost-bunsen-form
              bunsenModel=bunsenModel
              bunsenView=bunsenView
              disabled=disabled
              onChange=onChange
              onValidation=onValidation
              showAllErrors=showAllErrors
            }}`)
          })

          afterEach(function () {
            sandbox.restore()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.collapsible.handle),
              'does not render collapsible handle'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.number),
              'renders a bunsen number input'
            )
              .to.have.length(1)

            const $input = this.$(selectors.frost.number.input.enabled)

            expect(
              $input,
              'renders an enabled number input'
            )
              .to.have.length(1)

            expect(
              $input.prop('placeholder'),
              'does not have placeholder text'
            )
              .to.equal('')

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)
          })

          describe('when label defined in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    label: 'FooBar Baz',
                    model: 'foo'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.collapsible.handle),
                'does not render collapsible handle'
              )
                .to.have.length(0)

              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input'
              )
                .to.have.length(1)

              const $input = this.$(selectors.frost.number.input.enabled)

              expect(
                $input,
                'renders an enabled number input'
              )
                .to.have.length(1)

              expect(
                $input.prop('placeholder'),
                'does not have placeholder text'
              )
                .to.equal('')

              expect(
                this.$(selectors.bunsen.label).text().trim(),
                'renders expected label text'
              )
                .to.equal('FooBar Baz')

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)
            })
          })

          describe('when collapsible set to true in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    collapsible: true,
                    model: 'foo'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.collapsible.handle),
                'renders collapsible handle'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input'
              )
                .to.have.length(1)

              const $input = this.$(selectors.frost.number.input.enabled)

              expect(
                $input,
                'renders an enabled number input'
              )
                .to.have.length(1)

              expect(
                $input.prop('placeholder'),
                'does not have placeholder text'
              )
                .to.equal('')

              expect(
                this.$(selectors.bunsen.label).text().trim(),
                'renders expected label text'
              )
                .to.equal('Foo')

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)
            })
          })

          describe('when collapsible set to false in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    collapsible: false,
                    model: 'foo'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.collapsible.handle),
                'does not render collapsible handle'
              )
                .to.have.length(0)

              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input'
              )
                .to.have.length(1)

              const $input = this.$(selectors.frost.number.input.enabled)

              expect(
                $input,
                'renders an enabled number input'
              )
                .to.have.length(1)

              expect(
                $input.prop('placeholder'),
                'does not have placeholder text'
              )
                .to.equal('')

              expect(
                this.$(selectors.bunsen.label).text().trim(),
                'renders expected label text'
              )
                .to.equal('Foo')

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)
            })
          })

          describe('when placeholder defined in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    model: 'foo',
                    placeholder: 'Foo bar'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input'
              )
                .to.have.length(1)

              const $input = this.$(selectors.frost.number.input.enabled)

              expect(
                $input,
                'renders an enabled number input'
              )
                .to.have.length(1)

              expect(
                $input.prop('placeholder'),
                'has expected placeholder text'
              )
                .to.equal('Foo bar')

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

          describe('when property explicitly enabled in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    disabled: false,
                    model: 'foo'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
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

          describe('when property disabled in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    disabled: true,
                    model: 'foo'
                  }
                ],
                type: 'form',
                version: '2.0'
              })
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
                'informs consumer of validation results'
              )
                .to.equal(1)

              const validationResult = props.onValidation.lastCall.args[0]

              expect(
                validationResult.errors,
                'has no validation errors'
              )
                .to.eql([])

              expect(
                validationResult.warnings,
                'has no validation warnings'
              )
                .to.eql([])
            })
          })

          describe('when field is required', function () {
            beforeEach(function () {
              props.onValidation = sandbox.spy()

              this.setProperties({
                bunsenModel: {
                  properties: {
                    foo: {
                      type: propertyType
                    }
                  },
                  required: ['foo'],
                  type: 'object'
                },
                onValidation: props.onValidation
              })
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

              expect(
                props.onValidation.callCount,
                'informs consumer of validation results'
              )
                .to.equal(2)

              const validationResult = props.onValidation.lastCall.args[0]

              expect(
                validationResult.errors.length,
                'informs consumer there is one error'
              )
                .to.equal(1)

              expect(
                validationResult.warnings.length,
                'informs consumer there are no warnings'
              )
                .to.equal(0)
            })

            describe('when showAllErrors is false', function () {
              beforeEach(function () {
                props.onValidation = sandbox.spy()

                this.setProperties({
                  onValidation: props.onValidation,
                  showAllErrors: false
                })
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

                expect(
                  props.onValidation.callCount,
                  'does not inform consumer of validation results'
                )
                  .to.equal(0)
              })
            })

            describe('when showAllErrors is true', function () {
              beforeEach(function () {
                props.onValidation = sandbox.spy()

                this.setProperties({
                  onValidation: props.onValidation,
                  showAllErrors: true
                })
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

                expectBunsenInputToHaveError('foo', 'Field is required.')

                expect(
                  props.onValidation.callCount,
                  'does not inform consumer of validation results'
                )
                  .to.equal(0)
              })
            })
          })
        })
      })
  }
)
