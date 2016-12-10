import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {findTextInputs} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-detail | array of strings', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  describe('without initial value', function () {
    let props, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      props = {
        bunsenModel: {
          properties: {
            foo: {
              items: {
                type: 'string'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenView: undefined
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-detail
        bunsenModel=bunsenModel
        bunsenView=bunsenView
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.text),
        'does not render any bunsen text inputs'
      )
        .to.have.length(0)

      expect(
        findTextInputs(),
        'does not render any text inputs'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.array.sort.handle),
        'does not render any sort handles'
      )
        .to.have.length(0)

      const $button = this.$(selectors.frost.button.input.enabled)

      expect(
        $button,
        'does not have any buttons'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      const $emptyMsg = this.$(selectors.bunsen.array.emptyMsg)

      expect(
        $emptyMsg,
        'has empty array message'
      )
        .to.have.length(1)

      expect(
        $emptyMsg.text().trim(),
        'has empty array message'
      )
        .to.equal('List is currently empty.')
    })
  })

  describe('with initial value', function () {
    let props, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      props = {
        bunsenModel: {
          properties: {
            foo: {
              items: {
                type: 'string'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        value: {
          foo: ['bar', 'baz']
        }
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-detail
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        value=value
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      const $static = this.$(selectors.bunsen.renderer.static)

      expect(
        $static,
        'renders a bunsen static input for each array item'
      )
        .to.have.length(2)

      expect(
        this.$(selectors.bunsen.array.sort.handle),
        'does not render sort handle for array items'
      )
        .to.have.length(0)

      const $button = this.$(selectors.frost.button.input.enabled)

      expect(
        $button,
        'does not render any buttons'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.array.emptyMsg),
        'does not have empty array message'
      )
        .to.have.length(0)
    })
  })
})
