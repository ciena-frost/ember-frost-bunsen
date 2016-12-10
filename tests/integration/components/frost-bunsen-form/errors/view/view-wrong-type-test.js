import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-form | errors | view | wrong type', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(Logger, 'warn')

    this.setProperties({
      bunsenModel: {
        properties: {
          foo: {
            type: 'boolean'
          }
        },
        type: 'object'
      },
      bunsenView: 'foo'
    })

    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('renders as expected', function () {
    const $heading = this.$(selectors.bunsen.validationErrors.heading)
    const $error = this.$(selectors.bunsen.validationErrors.error)

    expect(
      $heading,
      'has validation errors heading'
    )
      .to.have.length(1)

    expect(
      $heading.text().trim(),
      'validation errors heading has expected text'
    )
      .to.equal('There seems to be something wrong with your view schema')

    expect(
      $error,
      'has one validation error'
    )
      .to.have.length(1)

    expect(
      $error.text().trim().replace(/\s+/g, ' '),
      'first validation error has correct text'
    )
      .to.equal('ERROR: # Invalid JSON')

    const actual = Logger.warn.lastCall.args[0]
    const expected = 'Property bunsenView does not match expected types: EmberObject, object'

    expect(
      actual.indexOf(expected),
      'logs expected warning'
    )
      .not.to.equal(-1)
  })
})
