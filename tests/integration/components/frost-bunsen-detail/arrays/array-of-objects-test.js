import {expect} from 'chai'
import {expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'
import {findTextInputs} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'
import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-detail / array of objects', function () {
  describe('without initial value', function () {
    setupDetailComponentTest({
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
      }
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

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
        expectCollapsibleHandles(0, 'bunsenDetail')

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
    setupDetailComponentTest({
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
      value: {
        foo: [
          {bar: 'test'},
          {baz: 1}
        ]
      }
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'bunsenDetail')

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
        expectCollapsibleHandles(0, 'bunsenDetail')

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
        expectCollapsibleHandles(0, 'bunsenDetail')

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
