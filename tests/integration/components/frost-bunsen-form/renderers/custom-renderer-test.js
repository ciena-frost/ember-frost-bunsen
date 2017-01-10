import {expect} from 'chai'
import Ember from 'ember'
const {RSVP} = Ember
import {setupComponentTest} from 'ember-mocha'
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
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('does not call the component custom validator on the initial validation loop', function () {
    expect(validateSpy.called).to.equal(false)
  })

  it('calls the component custom validator when the model changes', function () {
    this.set('bunsenModel', {
      foo: {
        type: 'number'
      }
    })
    expect(validateSpy.called).to.equal(true)
  })

  it('calls the component custom validator on top-level value changes', function () {
    this.set('value', {
      foo: 'bar'
    })
    expect(validateSpy.called).to.equal(true)
  })

  it('can call triggerValidation() to call the component custom validator', function () {
    renderer.triggerValidation()
    expect(validateSpy.called).to.equal(true)
  })

  it('can call onChange to call the component custom validator', function () {
    renderer.onChange('foo', 'bar')
    expect(validateSpy.called).to.equal(true)
  })
})
