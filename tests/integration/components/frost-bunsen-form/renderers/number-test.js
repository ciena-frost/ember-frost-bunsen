import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenNumberRendererWithState,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState,
  fillInBunsenNumberRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / number', function () {
  ;[
    'integer',
    'number'
  ]
    .forEach((propertyType) => {
      describe(`when property type is ${propertyType}`, function () {
        const ctx = setupFormComponentTest({
          bunsenModel: {
            properties: {
              foo: {
                type: propertyType
              }
            },
            type: 'object'
          }
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when hideLabel is set to true in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  hideLabel: true,
                  model: 'foo'
                }
              ],
              type: 'form',
              version: '2.0'
            })
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: null})
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when hideLabel is set to false in view', function () {
          beforeEach(function () {
            this.set('bunsenView', {
              cells: [
                {
                  hideLabel: false,
                  model: 'foo'
                }
              ],
              type: 'form',
              version: '2.0'
            })
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {count: 1})
          })
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
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'FooBar Baz'})
            expectOnValidationState(ctx, {count: 1})
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
            expectCollapsibleHandles(1)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {count: 1})
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
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {count: 1})
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
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {
              label: 'Foo',
              placeholder: 'Foo bar'
            })
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when form explicitly enabled', function () {
          beforeEach(function () {
            this.set('disabled', false)
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when form disabled', function () {
          beforeEach(function () {
            this.set('disabled', true)
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {
              disabled: true,
              label: 'Foo'
            })
            expectOnValidationState(ctx, {count: 1})
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
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {count: 1})
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
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {
              disabled: true,
              label: 'Foo'
            })
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when user inputs integer', function () {
          const input = 123

          beforeEach(function () {
            ctx.props.onValidation.reset()
            return fillInBunsenNumberRenderer('foo', `${input}`)
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {
              label: 'Foo',
              value: `${input}`
            })
            expectOnChangeState(ctx, {foo: input})
            expectOnValidationState(ctx, {count: 1})
          })
        })

        describe('when field is required', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()

            this.set('bunsenModel', {
              properties: {
                foo: {
                  type: propertyType
                }
              },
              required: ['foo'],
              type: 'object'
            })
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
            expectOnValidationState(ctx, {
              count: 1,
              errors: [
                {
                  code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                  params: ['foo'],
                  message: 'Field is required.',
                  path: '#/foo',
                  isRequiredError: true
                }
              ]
            })
          })

          describe('when showAllErrors is false', function () {
            beforeEach(function () {
              ctx.props.onValidation.reset()
              this.set('showAllErrors', false)
            })

            it('renders as expected', function () {
              expectCollapsibleHandles(0)
              expectBunsenNumberRendererWithState('foo', {label: 'Foo'})
              expectOnValidationState(ctx, {count: 0})
            })
          })

          describe('when showAllErrors is true', function () {
            beforeEach(function () {
              ctx.props.onValidation.reset()
              this.set('showAllErrors', true)
            })

            it('renders as expected', function () {
              expectCollapsibleHandles(0)
              expectBunsenNumberRendererWithState('foo', {
                error: 'Field is required.',
                label: 'Foo'
              })
              expectOnValidationState(ctx, {count: 0})
            })
          })
        })
      })
    })
})
