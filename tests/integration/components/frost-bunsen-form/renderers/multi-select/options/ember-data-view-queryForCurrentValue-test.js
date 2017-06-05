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
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component / frost-bunsen-form / renderer / multi-select selected filter /', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox, resolver, store

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    initialize()
    resolver = {}

    store = {
      query () {
        return new RSVP.Promise((resolve, reject) => {
          resolver.resolve = resolve
          resolver.reject = reject
        })
      },
      findByIds () {
        return new RSVP.Promise((resolve, reject) => {
          resolver.resolve = resolve
          resolver.reject = reject
        })
      }
    }
    sandbox.spy(store, 'query')
    sandbox.spy(store, 'findByIds')
    this.register('service:store', Service.extend(store))

    props = {
      bunsenModel: {
        properties: {
          foo: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'multi-select',
              options: {
                labelAttribute: 'label',
                modelType: 'node',
                query: {
                  baz: 'alpha',
                  filter: '[fizz]=$filter'
                },
                valueAttribute: 'value',
                queryForCurrentValue: true
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

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
    props = null
    resolver = null
    sandbox = null
  })

  it('should perform initial query', function () {
    expect(store.query).to.have.been.calledWith('node', {baz: 'alpha', filter: '[fizz]='})
  })

  describe('when query succeeds', function () {
    describe('when no initial value', function () {
      beforeEach(function () {
        run(() => {
          resolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 'bar'
            }),
            Ember.Object.create({
              label: 'baz',
              value: 'baz'
            })
          ])
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
          .not.to.equal(0)

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
            items: ['bar', 'baz'],
            opened: true,
            text: ''
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
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    placeholder: 'Foo bar',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
          this.set('bunsenView', {
            cells: [
              {
                disabled: false,
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                type: 'array',
                items: {
                  type: 'string'
                }
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
              'does not inform consumer of validation results'
            )
              .to.equal(0)
          })
        })
      })
    })

    describe('when initial value', function () {
      beforeEach(function () {
        this.set('value', {foo: ['bar']})

        run(() => {
          resolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 'bar'
            }),
            Ember.Object.create({
              label: 'baz',
              value: 'baz'
            })
          ])
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
          text: 'bar'
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
            items: ['bar', 'baz'],
            opened: true,
            text: 'bar'
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
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
                  }
                },
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
            text: 'bar'
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
            text: 'bar'
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
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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
                model: 'foo',
                renderer: {
                  name: 'multi-select',
                  options: {
                    labelAttribute: 'label',
                    modelType: 'node',
                    query: {
                      baz: 'alpha'
                    },
                    valueAttribute: 'value',
                    queryForCurrentValue: true
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

          this.set('bunsenModel', {
            properties: {
              foo: {
                type: 'array',
                items: {
                  type: 'string'
                }
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

    describe('when user types', function () {
      beforeEach(function () {
        $hook('my-form-foo').find('.frost-select').click()
        return wait().then(() => {
          $hook('my-form-foo-list-input-input').val('42').trigger('input')
          return wait()
        })
      })

      it('should make another query with the filter text', function () {
        expect(store.query).to.have.been.calledWith('node', {baz: 'alpha', filter: '[fizz]=42'})
      })
    })

    describe('when user types with selected item', function () {
      beforeEach(function () {
        run(() => {
          resolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: '0'
            }),
            Ember.Object.create({
              label: 'baz',
              value: '1'
            }),
            Ember.Object.create({
              label: 'qux',
              value: '2'
            })
          ])
        })

        $hook('my-form-foo').find('.frost-select').click()
        return wait().then(() => {
          $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
          return wait().then(() => {
            $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
            return wait().then(() => {
              $hook('my-form-foo-list-input-input').val('42').trigger('input')
              return wait()
            })
          })
        })
      })

      it('should make another query with the filter text', function () {
        expect(store.query).to.have.been.calledWith('node', {baz: 'alpha', filter: '[fizz]=42'})
      })

      it('should make a query for the selected items', function () {
        expect(store.findByIds).to.have.been.calledWith('node', ['0', '2'])
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
