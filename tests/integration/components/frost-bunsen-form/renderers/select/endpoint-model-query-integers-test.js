import {expect} from 'chai'
import Ember from 'ember'
const {RSVP, Service, run} = Ember
import {expectWithState as expectSelectWithState} from 'ember-frost-core/test-support/frost-select'
import {$hook, initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectBunsenInputToHaveError,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component / frost-bunsen-form / renderer / select endpoint model query integers', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    initialize()
  })

  afterEach(function () {
    sandbox.restore()
    sandbox = null
  })

  describe('when endpoint is literal string', function () {
    let props, resolver

    beforeEach(function () {
      resolver = {}

      this.register('service:ajax', Service.extend({
        request () {
          return new RSVP.Promise((resolve, reject) => {
            resolver.resolve = resolve
            resolver.reject = reject
          })
        }
      }))

      props = {
        bunsenModel: {
          properties: {
            foo: {
              endpoint: 'backdoor/api/',
              labelAttribute: 'label',
              query: {
                baz: 'alpha'
              },
              recordsPath: '',
              type: 'integer',
              valueAttribute: 'value'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        disabled: undefined,
        hook: 'my-form',
        onChange: sandbox.spy(),
        onError: sandbox.spy(),
        onValidation: sandbox.spy(),
        showAllErrors: undefined,
        value: undefined
      }

      this.setProperties(props)

      this.render(hbs`
        {{frost-select-outlet hook='selectOutlet'}}
        {{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          disabled=disabled
          hook=hook
          onChange=onChange
          onError=onError
          onValidation=onValidation
          showAllErrors=showAllErrors
          value=value
        }}
      `)

      return wait()
    })

    afterEach(function () {
      props = null
      resolver = null
    })

    describe('when query succeeds', function () {
      describe('when no initial value', function () {
        beforeEach(function () {
          run(() => {
            resolver.resolve([0, 1])
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true,
              text: ''
            })
          })

          describe('when first option selected', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
              return wait()
            })

            it('renders as expected', function () {
              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: '0'
              })

              expectOnChangeState({props}, {foo: 0})
              expectOnValidationState({props}, {count: 1})
            })
          })

          describe('when last option selected', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              $hook('my-form-foo-item', {index: 1}).trigger('mousedown')
              return wait()
            })

            it('renders as expected', function () {
              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: '1'
              })

              expectOnChangeState({props}, {foo: 1})
              expectOnValidationState({props}, {count: 1})
            })
          })
        })

        describe('when label defined in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

        describe('when collapsible is set to true in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(1, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

        describe('when collapsible is set to false in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

        describe('when placeholder defined in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'Foo bar'
            })

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
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              disabled: true,
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)
          })
        })

        describe('when property explicitly enabled in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)
          })
        })

        describe('when property disabled in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              disabled: true,
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)
          })
        })

        describe('when field is required', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            const bunsenModel = Object.assign({}, props.bunsenModel)
            bunsenModel.required = ['foo']
            this.set('bunsenModel', bunsenModel)
            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {
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
              props.onValidation = sandbox.spy()

              this.setProperties({
                onValidation: props.onValidation,
                showAllErrors: false
              })

              return wait()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.select.input),
                'renders a bunsen select input'
              )
                .to.have.length(1)

              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: ''
              })

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)

              expect(
                props.onValidation.callCount,
                'does inform consumer of validation results'
              )
                .to.equal(1)
            })
          })

          describe('when showAllErrors is true', function () {
            beforeEach(function () {
              props.onValidation = sandbox.spy()

              this.setProperties({
                onValidation: props.onValidation,
                showAllErrors: true
              })

              return wait()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.select.input),
                'renders a bunsen select input'
              )
                .to.have.length(1)

              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                error: true,
                text: ''
              })

              expectBunsenInputToHaveError('foo', 'Field is required.', 'my-form')

              expect(
                props.onValidation.callCount,
                'does inform consumer of validation results'
              )
                .to.equal(1)
            })
          })
        })
      })

      describe('when initial value', function () {
        beforeEach(function () {
          this.set('value', {foo: 0})

          run(() => {
            resolver.resolve([0, 1])
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: '0'
          })

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

          expectOnValidationState({props}, {count: 2})
        })

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true,
              text: '0'
            })
          })

          describe('when first option selected (initial value)', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
              return wait()
            })

            it('renders as expected', function () {
              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: '0'
              })

              expect(
                props.onChange.callCount,
                'does not trigger change since value is aleady selected'
              )
                .to.equal(0)

              expectOnValidationState({props}, {count: 0})
            })
          })

          describe('when last option selected', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              $hook('my-form-foo-item', {index: 1}).trigger('mousedown')
              return wait()
            })

            it('renders as expected', function () {
              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: '1'
              })

              expectOnChangeState({props}, {foo: 1})
              expectOnValidationState({props}, {count: 1})
            })
          })
        })

        describe('when label defined in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when collapsible is set to true in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(1, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when collapsible is set to false in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0, 'my-form')

            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

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

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when placeholder defined in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'Foo bar'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when form explicitly enabled', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            this.set('disabled', false)
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: '0'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when form disabled', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            this.set('disabled', true)
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              disabled: true,
              text: '0'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when property explicitly enabled in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when property disabled in view', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()

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

            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              disabled: true,
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when field is required', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            const bunsenModel = Object.assign({}, props.bunsenModel)
            bunsenModel.required = ['foo']
            this.set('bunsenModel', bunsenModel)
            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: ''
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState({props}, {count: 1})
          })

          describe('when showAllErrors is false', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              this.set('showAllErrors', false)
              return wait()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.select.input),
                'renders a bunsen select input'
              )
                .to.have.length(1)

              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: ''
              })

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)

              expectOnValidationState({props}, {count: 0})
            })
          })

          describe('when showAllErrors is true', function () {
            beforeEach(function () {
              props.onChange.reset()
              props.onValidation.reset()
              this.set('showAllErrors', true)
              return wait()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.select.input),
                'renders a bunsen select input'
              )
                .to.have.length(1)

              expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
                text: ''
              })

              expectOnValidationState({props}, {count: 0})
            })
          })
        })
      })
    })

    describe('when query fails', function () {
      beforeEach(function () {
        run(() => {
          resolver.reject({
            responseJSON: {
              errors: [{
                detail: 'It done broke, son.'
              }]
            }
          })
        })

        return wait()
      })

      it('should call onError', function () {
        expect(this.get('onError').lastCall.args).to.eql(['foo', [{
          path: 'foo',
          message: 'It done broke, son.'
        }]])
      })
    })
  })

  describe('when endpoint contains reference to another property', function () {
    beforeEach(function () {
      this.register('service:ajax', Service.extend({
        request (endpoint) {
          if (endpoint.indexOf('backdoor/api') === 0) {
            return RSVP.resolve([0, 1])
          }

          if (endpoint.indexOf('frontdoor/api') === 0) {
            return RSVP.resolve([2])
          }

          return RSVP.reject()
        }
      }))
    })

    describe('when other property is not present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: 'alpha'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: ''
        })

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

      describe('when referenced property set', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()

          this.set('value', {
            bar: 'backdoor'
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true
            })
          })
        })
      })
    })

    describe('when other property is present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: 'alpha'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined,
          value: {
            bar: 'backdoor'
          }
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: ''
        })

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

      describe('when expanded/opened', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo').find('.frost-select').click()
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            items: [0, 1],
            opened: true
          })
        })
      })

      describe('when other property value changed', function () {
        beforeEach(function () {
          props.onValidation.reset()
          this.set('value', {bar: 'frontdoor'})
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [2],
              opened: true
            })
          })
        })
      })
    })
  })

  describe('when endpoint and query contain references to other properties', function () {
    beforeEach(function () {
      this.register('service:ajax', Service.extend({
        request (endpoint) {
          if (endpoint.indexOf('backdoor/api') === 0) {
            return RSVP.resolve([0, 1])
          }

          return RSVP.reject()
        }
      }))
    })

    describe('when referenced properties are not present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: '${./baz}'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: ''
        })

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

      describe('when referenced property set', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()

          this.set('value', {
            bar: 'backdoor',
            baz: 'alpha'
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true
            })
          })
        })
      })
    })

    describe('when property referenced by endpoint is present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: '${./baz}'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined,
          value: {
            bar: 'backdoor'
          }
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: ''
        })

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

      describe('when property referenced by query is set', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()

          this.set('value', {
            bar: 'backdoor',
            baz: 'alpha'
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true
            })
          })
        })
      })
    })

    describe('when property referenced by query is present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: '${./baz}'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined,
          value: {
            baz: 'alpha'
          }
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: ''
        })

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

      describe('when property referenced by endpoint is set', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()

          this.set('value', {
            bar: 'backdoor',
            baz: 'alpha'
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: ''
          })

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

        describe('when expanded/opened', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo').find('.frost-select').click()
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              items: [0, 1],
              opened: true
            })
          })
        })
      })
    })

    describe('when referenced properties are present', function () {
      let props

      beforeEach(function () {
        props = {
          bunsenModel: {
            properties: {
              bar: {
                type: 'string'
              },
              foo: {
                endpoint: '${./bar}/api/',
                labelAttribute: 'label',
                query: {
                  baz: '${./baz}'
                },
                recordsPath: '',
                type: 'integer',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          hook: 'my-form',
          onChange: sandbox.spy(),
          onError: sandbox.spy(),
          onValidation: sandbox.spy(),
          showAllErrors: undefined,
          value: {
            bar: 'backdoor',
            baz: 'alpha'
          }
        }

        this.setProperties(props)

        this.render(hbs`
          {{frost-select-outlet hook='selectOutlet'}}
          {{frost-bunsen-form
            bunsenModel=bunsenModel
            bunsenView=bunsenView
            disabled=disabled
            hook=hook
            onChange=onChange
            onError=onError
            onValidation=onValidation
            showAllErrors=showAllErrors
            value=value
          }}
        `)

        return wait()
      })

      afterEach(function () {
        props = null
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: ''
        })

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

      describe('when expanded/opened', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo').find('.frost-select').click()
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            items: [0, 1],
            opened: true
          })
        })
      })
    })
  })
})
