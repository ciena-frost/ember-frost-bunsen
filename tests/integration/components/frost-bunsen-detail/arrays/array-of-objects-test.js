import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {findTextInputs} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-detail | array of objects', function () {
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
                properties: {
                  bar: {type: 'string'},
                  baz: {type: 'number'}
                },
                type: 'object'
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

    describe('when autoAdd enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                autoAdd: true,
                itemCell: {
                  children: [
                    {model: 'bar'},
                    {model: 'baz'}
                  ]
                }
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })
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
                properties: {
                  bar: {type: 'string'},
                  baz: {type: 'number'}
                },
                type: 'object'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        value: {
          foo: [
            {bar: 'test'},
            {baz: 1}
          ]
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
        'renders two bunsen static inputs for each array item (2 fields per item)'
      )
        .to.have.length(4)

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

    describe('when sortable enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                sortable: true,
                itemCell: {
                  children: [
                    {model: 'bar'},
                    {model: 'baz'}
                  ]
                }
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })
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
          'renders two bunsen static inputs for each array item (2 fields per item)'
        )
          .to.have.length(4)

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

    describe('when autoAdd enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                autoAdd: true,
                itemCell: {
                  children: [
                    {model: 'bar'},
                    {model: 'baz'}
                  ]
                }
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })
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
          'renders two bunsen static inputs for each array item (2 fields per item)'
        )
          .to.have.length(4)

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
})
