import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {after, before, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Integration: Component / frost-bunsen-form / errors / view / wrong type', function () {
  before(function () {
    sinon.spy(Logger, 'warn')
  })

  after(function () {
    Logger.warn.restore()
  })

  setupFormComponentTest({
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
