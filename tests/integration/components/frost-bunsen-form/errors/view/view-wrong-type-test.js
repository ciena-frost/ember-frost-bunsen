import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {settings} from 'ember-prop-types/mixins/prop-types'
import {after, before, describe, it} from 'mocha'
import sinon from 'sinon'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / errors / view / wrong type', function () {
  let originalThrowErrorsSetting

  before(function () {
    originalThrowErrorsSetting = settings.throwErrors
    settings.throwErrors = false
    sinon.spy(Logger, 'warn')
  })

  after(function () {
    settings.throwErrors = originalThrowErrorsSetting
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
    const expected = 'Expected property bunsenView to be one of expected types: [EmberObject, object] but instead got string'

    expect(
      actual.indexOf(expected),
      'logs expected warning'
    )
      .not.to.equal(-1)
  })
})
