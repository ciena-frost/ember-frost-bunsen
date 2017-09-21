import {expect} from 'chai'
import Ember from 'ember'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

const {Test} = Ember

import {
  expectBunsenButtonGroupRendererWithState,
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'
import {expectAsyncThrow, setupFormComponentTest} from 'dummy/tests/helpers/utils'

// @quincyle 2017-07-31
// Hack to fix test failing when using `throw`
// Issue introduced by https://github.com/emberjs/ember.js/pull/14898
Test.adapter = Test.MochaAdapter.extend({
  exception (error) {
    throw error
  }
}).create()

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

describe('Integration: Component / frost-bunsen-form / renderer / button-group', function () {
  describe('initialized', function () {
    setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            enum: ['bar', 'baz'],
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
              name: 'button-group'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      }
    })

    it('throws error when used on an array', function () {
      return expectAsyncThrow(() => {
        this.set('bunsenModel', {
          properties: {
            foo: {
              items: {
                type: 'string'
              },
              type: 'array'
            }
          },
          type: 'object'
        })
      }, 'button-group renderer cannot be used with type array')
    })

    it('throws error when used on an object', function () {
      return expectAsyncThrow(() => {
        this.set('bunsenModel', {
          properties: {
            foo: {
              type: 'object'
            }
          },
          type: 'object'
        })
      }, 'button-group renderer cannot be used with type object')
    })
  })

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
        const ctx = setupFormComponentTest({
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
          }
        })

        const buttonLabels = getButtonLabels(fooModel)

        it('renders as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenButtonGroupRendererWithState('foo', {
            buttons: buttonLabels,
            label: 'Foo'
          })
          expectOnValidationState(ctx, {count: 1})
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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenButtonGroupRendererWithState('foo', {
              buttons: buttonLabels,
              label: 'FooBar Baz'
            })
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when collapsible set to true in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: true,
                  model: 'foo',
                  renderer: {
                    name: 'button-group'
                  }
                }
              ],
              type: 'form',
              version: '2.0'
            })

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(1)
            expectBunsenButtonGroupRendererWithState('foo', {
              buttons: buttonLabels,
              label: 'Foo'
            })
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when collapsible set to false in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  collapsible: false,
                  model: 'foo',
                  renderer: {
                    name: 'button-group'
                  }
                }
              ],
              type: 'form',
              version: '2.0'
            })

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenButtonGroupRendererWithState('foo', {
              buttons: buttonLabels,
              label: 'Foo'
            })
            expectOnValidationState(ctx, {count: 1})
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

            return wait()
          })

          it('renders as expected', function () {
            expectBunsenButtonGroupRendererWithState('foo', {
              buttons: buttonLabels,
              label: 'Foo',
              size: 'small'
            })

            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when form explicitly enabled', function () {
          beforeEach(function () {
            this.set('disabled', false)
            return wait()
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
            return wait()
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

            return wait()
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

            return wait()
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

        describe('when button selected', function () {
          beforeEach(function () {
            ctx.props.onChange.reset()
            ctx.props.onValidation.reset()

            this.$(selectors.bunsen.renderer.buttonGroup).find('button:first').click()

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)

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
              .to.equal(true)

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
              .to.equal(true)

            expect(
              this.$(selectors.bunsen.label).text().trim(),
              'renders expected label text'
            )
              .to.equal('Foo')

            const foo = 'enum' in fooModel ? fooModel.enum[0] : true

            expect(
              ctx.props.onChange.lastCall.args[0],
              'provides consumer expected form value'
            )
              .to.eql({
                foo
              })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState(ctx, {count: 1})
          })

          describe('when button deselected', function () {
            beforeEach(function () {
              ctx.props.onChange.reset()
              ctx.props.onValidation.reset()

              this.$(selectors.bunsen.renderer.buttonGroup).find('button:first').click()

              return wait()
            })

            it('renders as expected', function () {
              expectCollapsibleHandles(0)

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
                .to.equal(true)

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
                .to.equal(true)

              expect(
                this.$(selectors.bunsen.label).text().trim(),
                'renders expected label text'
              )
                .to.equal('Foo')

              expect(
                ctx.props.onChange.lastCall.args[0],
                'provides consumer expected form value'
              )
                .to.eql({})

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)

              expectOnValidationState(ctx, {count: 1})
            })
          })
        })

        describe('when options passed in', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  model: 'foo',
                  renderer: {
                    name: 'button-group',
                    options: {
                      bar: true,
                      baz: 'spam',
                      foo: 1,
                      icon: 'round-add'
                    }
                  }
                }
              ],
              type: 'form',
              version: '2.0'
            })

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenButtonGroupRendererWithState('foo', {
              buttons: buttonLabels,
              label: 'Foo'
            })
            expectOnValidationState(ctx, {count: 1})
            expect(this.$('.frost-icon')).to.have.length(2)
          })
        })

        if (fooModel.type !== 'boolean') { // boolean doesn't require enum
          it('throws error when enum is missing', function () {
            return expectAsyncThrow(() => {
              this.set('bunsenModel', {
                properties: {
                  foo: {
                    type: fooModel.type
                  }
                },
                type: 'object'
              })
            }, `In order to use a button-group renderer with type ${fooModel.type} enum must be present`)
          })
        }
      })
    })
})
