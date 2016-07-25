import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | errors | view | cells missing',
  {
    integration: true
  },
  function () {
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
          cellDefinitions: {
            main: {
              children: [
                {
                  model: 'foo'
                }
              ]
            }
          },
          type: 'form',
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
        .to.equal('There seems to be something wrong with your schema')

      expect(
        $error,
        'has one validation error'
      )
        .to.have.length(1)

      expect(
        $error.text().trim().replace(/\s+/g, ' '),
        'validation error has correct text'
      )
        .to.equal('#/cells Field is required.')
    })
  }
)
