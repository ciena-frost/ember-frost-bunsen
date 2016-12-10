import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-form | errors | view | version wrong type', function () {
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
        type: 'form',
        version: 2
      }
    })

    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)
  })

  it('renders as expected', function () {
    const $heading = this.$(selectors.bunsen.validationErrors.heading)
    const $errors = this.$(selectors.bunsen.validationErrors.error)

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
      $errors,
      'has two validation errors'
    )
      .to.have.length(2)

    expect(
      $errors.eq(0).text().trim().replace(/\s+/g, ' '),
      'first validation error has correct text'
    )
      .to.equal('ERROR: #/version Expected type string but found type integer')

    expect(
      $errors.eq(1).text().trim().replace(/\s+/g, ' '),
      'second validation error has correct text'
    )
      .to.equal('ERROR: #/version No enum match for: 2')
  })
})
