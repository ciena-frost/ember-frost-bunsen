import {expect} from 'chai'
import Ember from 'ember'
const {RSVP, Service, run} = Ember
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

import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component / frost-bunsen-form / renderer / select view queryForCurrentValue', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox, queryResolver, findRecordResolver

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    initialize()
    queryResolver = {}
    findRecordResolver = {}

    this.register('service:store', Service.extend({
      findRecord () {
        return new RSVP.Promise((resolve, reject) => {
          findRecordResolver.resolve = resolve
          findRecordResolver.reject = reject
        })
      },
      query () {
        return new RSVP.Promise((resolve, reject) => {
          queryResolver.resolve = resolve
          queryResolver.reject = reject
        })
      }
    }))

    props = {
      bunsenModel: {
        properties: {
          foo: {
            type: 'number'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'select',
              options: {
                labelAttribute: 'label',
                modelType: 'node',
                query: {
                  baz: 'alpha'
                },
                queryForCurrentValue: true,
                valueAttribute: 'value'
              }
            }
          }
        ],
        type: 'form',
        version: '2.0'
      },
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
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when queries succeed', function () {
    describe('when no initial value', function () {
      beforeEach(function () {
        run(() => {
          queryResolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 1
            }),
            Ember.Object.create({
              label: 'baz',
              value: 2
            })
          ])
        })
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
          return $hook('my-form-foo').find('.frost-select').click()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            items: ['bar', 'baz'],
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
              text: 'bar'
            })

            expectOnChangeState({props}, {foo: 1})
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
              text: 'baz'
            })

            expectOnChangeState({props}, {foo: 2})
            expectOnValidationState({props}, {count: 1})
          })
        })
      })

      describe('when label defined in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                label: 'FooBar Baz',
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                model: 'foo',
                placeholder: 'Foo bar',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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

          this.set('bunsenModel', {
            properties: {
              foo: {
                enum: [
                  'bar',
                  'baz'
                ],
                type: 'string'
              }
            },
            required: ['foo'],
            type: 'object'
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
              'does not inform consumer of validation results'
            )
              .to.equal(0)
          })
        })
      })
    })

    describe('when initial value outside of regular query', function () {
      beforeEach(function () {
        this.set('value', {foo: 42})
        props.onValidation.reset()
        props.onChange.reset()
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

        return wait().then(() => {
          queryResolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 1
            }),
            Ember.Object.create({
              label: 'baz',
              value: 2
            })
          ])
          findRecordResolver.resolve(Ember.Object.create({
            label: 'foo',
            value: 42
          }))
          return wait()
        })
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'foo'
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

        expectOnValidationState({props}, {count: 1})
      })

      describe('when expanded/opened', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          return $hook('my-form-foo').find('.frost-select').click()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            items: ['bar', 'baz', 'foo'],
            opened: true,
            text: 'foo'
          })
        })

        describe('when last option selected (initial value)', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'foo'
            })

            expect(
              props.onChange.callCount,
              'does not trigger change since value is aleady selected'
            )
              .to.equal(0)

            expectOnValidationState({props}, {count: 0})
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
              text: 'bar'
            })

            expectOnChangeState({props}, {foo: 1})
            expectOnValidationState({props}, {count: 1})
          })
        })
      })

      describe('when label defined in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                label: 'FooBar Baz',
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                model: 'foo',
                placeholder: 'Foo bar',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'foo'
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
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            disabled: true,
            text: 'foo'
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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

          this.set('bunsenModel', {
            properties: {
              foo: {
                type: 'number'
              }
            },
            required: ['foo'],
            type: 'object'
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

          expectOnValidationState({props}, {count: 1})
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
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              error: false,
              text: ''
            })

            expect(
              props.onValidation.callCount,
              'does not inform consumer of validation results'
            )
              .to.equal(0)
          })
        })
      })
    })

    describe('when initial value inside of regular query', function () {
      beforeEach(function () {
        this.set('value', {foo: 42})
        this.set('bunsenModel.properties.foo.type', 'number')
        props.onValidation.reset()
        props.onChange.reset()
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

        return wait().then(() => {
          queryResolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 1
            }),
            Ember.Object.create({
              label: 'baz',
              value: 2
            }),
            Ember.Object.create({
              label: 'foo',
              value: 42
            })
          ])
          findRecordResolver.resolve(Ember.Object.create({
            label: 'foo',
            value: 42
          }))
          return wait()
        })
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'foo'
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

        expectOnValidationState({props}, {count: 1})
      })

      describe('when expanded/opened', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          return $hook('my-form-foo').find('.frost-select').click()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            items: ['bar', 'baz', 'foo'],
            opened: true,
            text: 'foo'
          })
        })

        describe('when last option selected (initial value)', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'foo'
            })

            expect(
              props.onChange.callCount,
              'does not trigger change since value is aleady selected'
            )
              .to.equal(0)

            expectOnValidationState({props}, {count: 0})
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
              text: 'bar'
            })

            expectOnChangeState({props}, {foo: 1})
            expectOnValidationState({props}, {count: 1})
          })
        })
      })

      describe('when label defined in view', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                label: 'FooBar Baz',
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                collapsible: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                model: 'foo',
                placeholder: 'Foo bar',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'foo'
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
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            disabled: true,
            text: 'foo'
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: false,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: true,
                model: 'foo',
                renderer: {
                  name: 'select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    queryForCurrentValue: true,
                    valueAttribute: 'value'
                  }
                }
              }
            ],
            type: 'form',
            version: '2.0'
          })
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

          this.set('bunsenModel', {
            properties: {
              foo: {
                type: 'number'
              }
            },
            required: ['foo'],
            type: 'object'
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

          expectOnValidationState({props}, {count: 1})
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
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              error: false,
              text: ''
            })

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

  describe('when query fails', function () {
    beforeEach(function () {
      run(() => {
        queryResolver.reject({
          responseJSON: {
            errors: [{
              detail: 'It done broke, son.'
            }]
          }
        })
      })
    })

    it('should call onError', function () {
      expect(this.get('onError').lastCall.args).to.eql(['foo', [{
        path: 'foo',
        message: 'It done broke, son.'
      }]])
    })
  })

  describe('when findRecord fails', function () {
    beforeEach(function () {
      this.set('value', {foo: 42})
      props.onValidation.reset()
      props.onChange.reset()
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

      run(() => {
        findRecordResolver.reject({
          responseJSON: {
            errors: [{
              detail: 'It done broke, son.'
            }]
          }
        })
      })
    })

    it('should call onError', function () {
      expect(this.get('onError').lastCall.args).to.eql(['foo', [{
        path: 'foo',
        message: 'It done broke, son.'
      }]])
    })
  })
})
