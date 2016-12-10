import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-form | errors | view | type missing', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  beforeEach(function () {
    this.setProperties({
      bunsenModel: {
        properties: {
          foo: {
            type: 'boolean'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo'
          }
        ],
        version: '2.0'
      }
    })

    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)
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
      'validation error has correct text'
    )
      .to.equal('ERROR: #/type Field is required.')
  })
})
