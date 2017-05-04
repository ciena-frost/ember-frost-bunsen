import {expect} from 'chai'
import Ember from 'ember'
const {RSVP} = Ember
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {AbstractInput} from 'ember-frost-bunsen'

describe('Integration: Component / frost-bunsen-form / renderer / custom', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox, rendererComponent, validationResult, validateSpy, renderer

  beforeEach(function () {
    sandbox = sinon.sandbox.create()

    validationResult = {
      value: {
        errors: [],
        warnings: []
      }
    }

    validateSpy = sandbox.stub().returns(RSVP.resolve(validationResult))

    rendererComponent = AbstractInput.extend({
      init () {
        renderer = this
        this._super(...arguments)
        this.registerValidator(this)
      },
      validate: validateSpy
    })

    props = {
      bunsenModel: {
        properties: {
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
              name: 'foo-renderer'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      },
      onChange: sandbox.spy(),
      onValidation: sandbox.spy(),
      renderers: {
        'foo-renderer': 'foo-renderer'
      },
      value: {}
    }

    this.setProperties(props)
    this.registry.register('component:foo-renderer', rendererComponent)

    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      disabled=disabled
      onChange=onChange
      onValidation=onValidation
      showAllErrors=showAllErrors
      renderers=renderers
      value=value
    }}`)

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('does not call the component custom validator on the initial validation loop', function () {
    expect(validateSpy.called).to.equal(false)
  })

  describe('when model changes', function () {
    beforeEach(function () {
      this.set('bunsenModel', {
        foo: {
          type: 'number'
        }
      })
      return wait()
    })

    it('triggers custom validator', function () {
      expect(validateSpy.called).to.equal(true)
    })
  })

  describe('when top-level value changes', function () {
    beforeEach(function () {
      this.set('value', {
        foo: 'bar'
      })

      return wait()
    })

    it('triggers custom validator', function () {
      expect(validateSpy.called).to.equal(true)
    })
  })

  describe('when validation triggered', function () {
    beforeEach(function () {
      renderer.triggerValidation()
      return wait()
    })

    it('calls the custom validator', function () {
      expect(validateSpy.called).to.equal(true)
    })
  })

  describe('when onChange called', function () {
    beforeEach(function () {
      renderer.onChange('foo', 'bar')
      return wait()
    })

    it('calls the custom validator', function () {
      expect(validateSpy.called).to.equal(true)
    })
  })
})
