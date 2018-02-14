import {expect} from 'chai'
import Ember from 'ember'
const {RSVP, Service, run, typeOf} = Ember
import {expectWithState as expectSelectWithState} from 'ember-frost-core/test-support/frost-select'
import {$hook, initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'

const description = 'Integration: Component / frost-bunsen-form / renderer / ' +
  'select Ember Data query parent reference'

describe(description, function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox, resolver

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    initialize()
    resolver = {}

    this.register('service:store', Service.extend({
      query (model, params) {
        if (typeOf(params) !== 'object') {
          throw new Error(
            "Assertion Failed: You need to pass a query hash to the store's query method"
          )
        }

        return new RSVP.Promise((resolve, reject) => {
          resolver.resolve = resolve
          resolver.reject = reject
        })
      }
    }))

    props = {
      bunsenModel: {
        properties: {
          bar: {
            type: 'string'
          },
          parent: {
            properties: {
              foo: {
                labelAttribute: 'label',
                modelType: 'node',
                query: {
                  bar: '${../bar}'
                },
                type: 'string',
                valueAttribute: 'value'
              }
            },
            type: 'object'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'parent.foo'
          }
        ],
        type: 'form',
        version: '2.0'
      },
      hook: 'my-form',
      onChange: sandbox.spy(),
      onError: sandbox.spy(),
      onValidation: sandbox.spy(),
      value: {
        bar: 'Test'
      }
    }

    this.setProperties(props)

    this.render(hbs`
      {{frost-select-outlet hook='selectOutlet'}}
      {{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        hook=hook
        onChange=onChange
        onError=onError
        onValidation=onValidation
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

        expectSelectWithState($hook('my-form-parent.foo').find('.frost-select'), {
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

    describe('when initial value', function () {
      beforeEach(function () {
        this.set('value', {
          bar: 'Test',
          parent: {
            foo: 'bar'
          }
        })

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

        expectSelectWithState($hook('my-form-parent.foo').find('.frost-select'), {
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
      expect(this.get('onError').lastCall.args).to.eql(['parent.foo', [{
        path: 'parent.foo',
        message: 'It done broke, son.'
      }]])
    })
  })
})
