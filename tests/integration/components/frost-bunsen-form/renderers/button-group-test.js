import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

/**
 * Get button labels for bunsenModel's enum options
 * @param {BunsenModel} bunsenModel - bunsen mode
 * @returns {Array<String>} button labels
 */
function getButtonLabels (bunsenModel) {
  if (bunsenModel.type === 'boolean') {
    return ['On', 'Off']
  }

  return bunsenModel.enum
    .map((option) => Ember.String.capitalize(`${option}`))
}

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | button-group',
  {
    integration: true
  },
  function () {
    ;[
      {
        type: 'boolean'
      },
      {
        enum: [0, 1],
        type: 'integer'
      },
      {
        enum: [0.5, 1.5],
        type: 'number'
      },
      {
        enum: ['bar', 'baz'],
        type: 'string'
      }
    ]
      .forEach((fooModel) => {
        describe(`when property type is ${fooModel.type}`, function () {
          let props, sandbox

          const buttonLabels = getButtonLabels(fooModel)

          beforeEach(function () {
            sandbox = sinon.sandbox.create()

            props = {
              bunsenModel: {
                properties: {
                  foo: fooModel
                },
                type: 'object'
              },
              bunsenView: {
                cells: [
                  {
                    model: 'foo',
                    renderer: {
                      name: 'button-group'
                    }
                  }
                ],
                type: 'form',
                version: '2.0'
              },
              disabled: undefined,
              onChange: sandbox.spy(),
              onValidation: sandbox.spy()
            }

            this.setProperties(props)

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
              this.$(selectors.bunsen.renderer.buttonGroup),
              'renders a bunsen button-group input'
            )
              .to.have.length(1)

            const $buttons = this.$(selectors.frost.button.input.enabled)

            expect(
              $buttons,
              'renders enabled buttons'
            )
              .to.have.length(2)

            const $firstButton = $buttons.eq(0)

            expect(
              $firstButton.text().trim(),
              'first button has expected text'
            )
              .to.equal(buttonLabels[0])

            expect(
              $firstButton.hasClass(selectors.frost.button.size.medium),
              'first button is correct size'
            )
              .to.be.true

            const $secondButton = $buttons.eq(1)

            expect(
              $secondButton.text().trim(),
              'second button has expected text'
            )
              .to.equal(buttonLabels[1])

            expect(
              $secondButton.hasClass(selectors.frost.button.size.medium),
              'first button is correct size'
            )
              .to.be.true

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

          describe('when label defined in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    label: 'FooBar Baz',
                    model: 'foo',
                    renderer: {
                      name: 'button-group'
                    }
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.buttonGroup),
                'renders a bunsen button-group input'
              )
                .to.have.length(1)

              const $buttons = this.$(selectors.frost.button.input.enabled)

              expect(
                $buttons,
                'renders enabled buttons'
              )
                .to.have.length(2)

              expect(
                $buttons.eq(0).text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $buttons.eq(1).text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

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

          describe('when size defined in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    model: 'foo',
                    renderer: {
                      name: 'button-group',
                      size: 'small'
                    }
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.buttonGroup),
                'renders a bunsen button-group input'
              )
                .to.have.length(1)

              const $buttons = this.$(selectors.frost.button.input.enabled)

              expect(
                $buttons,
                'renders enabled buttons'
              )
                .to.have.length(2)

              const $firstButton = $buttons.eq(0)

              expect(
                $firstButton.text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $firstButton.hasClass(selectors.frost.button.size.small),
                'first button is correct size'
              )
                .to.be.true

              const $secondButton = $buttons.eq(1)

              expect(
                $secondButton.text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

              expect(
                $secondButton.hasClass(selectors.frost.button.size.small),
                'first button is correct size'
              )
                .to.be.true

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
              const $buttons = this.$(selectors.frost.button.input.enabled)

              expect(
                $buttons,
                'renders enabled buttons'
              )
                .to.have.length(2)

              expect(
                $buttons.eq(0).text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $buttons.eq(1).text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

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
              const $buttons = this.$(selectors.frost.button.input.disabled)

              expect(
                $buttons,
                'renders disabled buttons'
              )
                .to.have.length(2)

              expect(
                $buttons.eq(0).text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $buttons.eq(1).text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)
            })
          })

          describe('when property explicitly enabled in view', function () {
            beforeEach(function () {
              this.set('bunsenView', {
                cells: [
                  {
                    disabled: false,
                    model: 'foo',
                    renderer: {
                      name: 'button-group'
                    }
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              const $buttons = this.$(selectors.frost.button.input.enabled)

              expect(
                $buttons,
                'renders enabled buttons'
              )
                .to.have.length(2)

              expect(
                $buttons.eq(0).text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $buttons.eq(1).text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

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
                    model: 'foo',
                    renderer: {
                      name: 'button-group'
                    }
                  }
                ],
                type: 'form',
                version: '2.0'
              })
            })

            it('renders as expected', function () {
              const $buttons = this.$(selectors.frost.button.input.disabled)

              expect(
                $buttons,
                'renders disabled buttons'
              )
                .to.have.length(2)

              expect(
                $buttons.eq(0).text().trim(),
                'first button has expected text'
              )
                .to.equal(buttonLabels[0])

              expect(
                $buttons.eq(1).text().trim(),
                'second button has expected text'
              )
                .to.equal(buttonLabels[1])

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)
            })
          })
        })
      })
  }
)
