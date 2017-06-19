import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {
  expectButtonWithState,
  fillIn,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / array of strings', function () {
  describe('without initial value', function () {
    const ctx = setupFormComponentTest({
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
      }
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)

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

      expectButtonWithState($button, {
        icon: 'round-add',
        text: 'Add foo'
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx, {count: 1})
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

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

        expectButtonWithState($button, {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('when form disabled', function () {
      beforeEach(function () {
        this.set('disabled', true)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

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

        const $button = this.$(selectors.frost.button.input.disabled)

        expectButtonWithState($button, {
          disabled: true,
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('when collapsible set to true in view', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              collapsible: true,
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(1)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'does not render a bunsen text input'
        )
          .to.have.length(0)

        expect(
          findTextInputs(),
          'does not render an enabled text input'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle'
        )
          .to.have.length(0)

        const $button = this.$(selectors.frost.button.input.enabled)

        expectButtonWithState($button, {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when user adds item', function () {
        beforeEach(function () {
          this.$(selectors.frost.button.input.enabled).click()
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(1)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for item'
          )
            .to.have.length(1)

          expect(
            findTextInputs({
              disabled: false
            }),
            'renders an enabled text input for item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle'
          )
            .to.have.length(0)

          const $buttons = this.$(selectors.frost.button.input.enabled)

          expect(
            $buttons,
            'has an enabled button for removing item plus an add button'
          )
            .to.have.length(2)

          expectButtonWithState($buttons.eq(0), {
            text: 'Remove'
          })

          expectButtonWithState($buttons.eq(1), {
            icon: 'round-add',
            text: 'Add foo'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 2})
        })

        describe('when user removes item', function () {
          beforeEach(function () {
            this.$(selectors.frost.button.input.enabled).first().click()
            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(1)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'does not render a bunsen text input'
            )
              .to.have.length(0)

            expect(
              findTextInputs(),
              'does not render an enabled text input'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.array.sort.handle),
              'does not render sort handle'
            )
              .to.have.length(0)

            const $button = this.$(selectors.frost.button.input.enabled)

            expectButtonWithState($button, {
              icon: 'round-add',
              text: 'Add foo'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            const validationResult = ctx.props.onValidation.lastCall.args[0]

            expect(
              validationResult.errors.length,
              'informs consumer there are no errors'
            )
              .to.equal(0)

            expect(
              validationResult.warnings.length,
              'informs consumer there are no warnings'
            )
              .to.equal(0)
          })
        })
      })
    })

    describe('when compact enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                compact: true,
                itemCell: {
                  hideLabel: true
                }
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

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

        expectButtonWithState($button, {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when users adds item', function () {
        beforeEach(function () {
          this.$(selectors.frost.button.input.enabled).trigger('click')
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen boolean input'
          )
            .to.have.length(1)

          const $textInputs = findTextInputs({
            disabled: false
          })

          expect(
            $textInputs,
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle'
          )
            .to.have.length(0)

          const $buttons = this.$(selectors.frost.button.input.enabled)

          expect(
            $buttons,
            'has an enabled button for removing item as well as adding an item'
          )
            .to.have.length(2)

          const $removeButton = $buttons.first()

          expectButtonWithState($removeButton, {
            text: 'Remove'
          })

          expectButtonWithState($buttons.last(), {
            icon: 'round-add',
            text: 'Add foo'
          })

          const removeButtonOffset = $removeButton.offset()
          const $textInput = $textInputs.first()
          const textInputOffset = $textInput.offset()

          expect(
            removeButtonOffset.left,
            'renders remove button to right of text input'
          )
            .to.be.at.least(
              textInputOffset.left + $textInput.width()
            )

          expect(
            removeButtonOffset.top,
            'renders remove button inline with text input'
          )
            .to.be.within(
              textInputOffset.top - 5,
              textInputOffset.top + $textInput.height() + 5
            )

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 2})
        })

        describe('when user removes item', function () {
          beforeEach(function () {
            this.$(selectors.frost.button.input.enabled).first().click()
            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'does not render any bunsen boolean inputs'
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

            expectButtonWithState($button, {
              icon: 'round-add',
              text: 'Add foo'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expectOnValidationState(ctx, {count: 3})
          })
        })
      })
    })

    describe('when users adds item', function () {
      beforeEach(function () {
        this.$(selectors.frost.button.input.enabled).trigger('click')
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen boolean input'
        )
          .to.have.length(1)

        expect(
          findTextInputs({
            disabled: false
          }),
          'renders an enabled text input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle'
        )
          .to.have.length(0)

        const $buttons = this.$(selectors.frost.button.input.enabled)
        const $removeButton = $buttons.first()
        const $addButton = $buttons.last()

        expect(
          $buttons,
          'has an enabled button for removing item as well as adding an item'
        )
          .to.have.length(2)

        expectButtonWithState($removeButton, {
          text: 'Remove'
        })

        expectButtonWithState($addButton, {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 2})
      })

      describe('when user removes item', function () {
        beforeEach(function () {
          this.$(selectors.frost.button.input.enabled).first().click()
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'does not render any bunsen boolean inputs'
          )
            .to.have.length(0)

          expect(
            findTextInputs(),
            'does not render any checkbox inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render any sort handles'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.enabled)

          expectButtonWithState($button, {
            icon: 'round-add',
            text: 'Add foo'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 3})
        })
      })
    })

    describe('when autoAdd enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                autoAdd: true
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input for auto added item'
        )
          .to.have.length(1)

        expect(
          findTextInputs({
            disabled: false
          }),
          'renders an enabled text input for auto added item'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle for auto added array item'
        )
          .to.have.length(0)

        const $button = this.$(selectors.frost.button.input.enabled)

        expectButtonWithState($button, {
          text: 'Remove'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when user inputs value', function () {
        beforeEach(function () {
          fillIn('bunsenForm-foo.0-input', 'bar')
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for item plus one'
          )
            .to.have.length(2)

          expect(
            findTextInputs({
              disabled: false
            }),
            'renders an enabled text input for item plus one'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle for auto added array item'
          )
            .to.have.length(0)

          const $buttons = this.$(selectors.frost.button.input.enabled)

          expect(
            $buttons,
            'has an enabled button for removing item plus one'
          )
            .to.have.length(2)

          expectButtonWithState($buttons.eq(0), {
            text: 'Remove'
          })

          expectButtonWithState($buttons.eq(1), {
            text: 'Remove'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 2})
        })

        describe('when user clears input', function () {
          beforeEach(function () {
            fillIn('bunsenForm-foo.0-input', '')
            return wait()
          })

          it('renders as expected', function () {
            expectCollapsibleHandles(0)

            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input for auto added item'
            )
              .to.have.length(1)

            expect(
              findTextInputs({
                disabled: false
              }),
              'renders an enabled text input for auto added item'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.array.sort.handle),
              'does not render sort handle for auto added array item'
            )
              .to.have.length(0)

            const $button = this.$(selectors.frost.button.input.enabled)

            expectButtonWithState($button, {
              text: 'Remove'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            const validationResult = ctx.props.onValidation.lastCall.args[0]

            /* FIXME: getting the following error when we expect no errors (MRD - 2016-07-24)
             *
             *   {
             *     "code": "INVALID_TYPE",
             *     "message": "Expected type string but found type null",
             *     "params": ["string", "null"],
             *     "path": "#/foo/0",
             *     "schemaId": undefined
             *   }
             *
            expect(
              validationResult.errors.length,
              'informs consumer there are no errors'
            )
              .to.equal(0)
            */

            expect(
              validationResult.warnings.length,
              'informs consumer there are no warnings'
            )
              .to.equal(0)
          })
        })
      })
    })

    describe('when maxItems', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.set('bunsenModel', {
          properties: {
            foo: {
              items: {
                type: 'string'
              },
              maxItems: 1,
              type: 'array'
            }
          },
          type: 'object'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

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

        expectButtonWithState($button, {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when user adds item (maxItems reached)', function () {
        beforeEach(function () {
          this.$(selectors.frost.button.input.enabled).trigger('click')
          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item'
          )
            .to.have.length(1)

          expect(
            findTextInputs({
              disabled: false
            }),
            'renders an enabled text input for each array item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle for array items'
          )
            .to.have.length(0)

          const $buttons = this.$(selectors.frost.button.input.enabled)

          expect(
            $buttons,
            'has three enabled buttons for removing item'
          )
            .to.have.length(1)

          expectButtonWithState($buttons.eq(0), {
            text: 'Remove'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 2})
        })
      })
    })
  })

  describe('with initial value', function () {
    const ctx = setupFormComponentTest({
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
      value: {
        foo: ['bar', 'baz']
      }
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      const $inputs = this.$(selectors.bunsen.renderer.text)
      const value = this.get('value')

      expect(
        $inputs,
        'renders a bunsen text input for each array item'
      )
        .to.have.length(2)

      $inputs.each((index, el) => {
        expect(
          el.getElementsByTagName('input')[0].value,
          'has the correct values'
        )
          .to.equal(value.foo[index])
      })

      expect(
        findTextInputs({
          disabled: false
        }),
        'renders an enabled text input for each array item'
      )
        .to.have.length(2)

      expect(
        this.$(selectors.bunsen.array.sort.handle),
        'does not render sort handle for array items'
      )
        .to.have.length(0)

      const $buttons = this.$(selectors.frost.button.input.enabled)

      expect(
        $buttons,
        'has three enabled buttons (1 for adding and 2 for removing)'
      )
        .to.have.length(3)

      expectButtonWithState($buttons.eq(0), {
        text: 'Remove'
      })

      expectButtonWithState($buttons.eq(1), {
        text: 'Remove'
      })

      expectButtonWithState($buttons.eq(2), {
        icon: 'round-add',
        text: 'Add foo'
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx, {count: 1})
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        const $inputs = this.$(selectors.bunsen.renderer.text)
        const value = this.get('value')

        expect(
          $inputs,
          'renders a bunsen text input for each array item'
        )
          .to.have.length(2)

        $inputs.each((index, el) => {
          expect(
            el.getElementsByTagName('input')[0].value,
            'has the correct values'
          )
            .to.equal(value.foo[index])
        })

        expect(
          findTextInputs({
            disabled: false
          }),
          'renders an enabled text input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle for array items'
        )
          .to.have.length(0)

        const $buttons = this.$(selectors.frost.button.input.enabled)

        expect(
          $buttons,
          'has three enabled buttons (1 for adding and 2 for removing)'
        )
          .to.have.length(3)

        expectButtonWithState($buttons.eq(0), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(1), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(2), {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('when form disabled', function () {
      beforeEach(function () {
        this.set('disabled', true)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input for each array item'
        )
          .to.have.length(2)

        expect(
          findTextInputs({
            disabled: true
          }),
          'renders a disabled text input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle for array items'
        )
          .to.have.length(0)

        const $buttons = this.$(selectors.frost.button.input.disabled)

        expect(
          $buttons,
          'has three disabled buttons (1 for adding and 2 for removing)'
        )
          .to.have.length(3)

        expectButtonWithState($buttons.eq(0), {
          disabled: true,
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(1), {
          disabled: true,
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(2), {
          disabled: true,
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })

      describe('when sortable enabled', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cells: [
              {
                arrayOptions: {
                  sortable: true
                },
                model: 'foo'
              }
            ],
            type: 'form',
            version: '2.0'
          })

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0)

          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item'
          )
            .to.have.length(2)

          expect(
            findTextInputs({
              disabled: true
            }),
            'renders a disabled text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'renders a sort handle for each array item'
          )
            .to.have.length(2)

          // TODO: add test that ensures sort handles appear disabled

          const $buttons = this.$(selectors.frost.button.input.disabled)

          expect(
            $buttons,
            'has three disabled buttons (1 for adding and 2 for removing)'
          )
            .to.have.length(3)

          expectButtonWithState($buttons.eq(0), {
            disabled: true,
            text: 'Remove'
          })

          expectButtonWithState($buttons.eq(1), {
            disabled: true,
            text: 'Remove'
          })

          expectButtonWithState($buttons.eq(2), {
            disabled: true,
            icon: 'round-add',
            text: 'Add foo'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expectOnValidationState(ctx, {count: 1})
        })
      })
    })

    describe('when autoAdd enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                autoAdd: true
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input for each array item plus one'
        )
          .to.have.length(3)

        expect(
          findTextInputs({
            disabled: false
          }),
          'renders an enabled text input for each array item plus one'
        )
          .to.have.length(3)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'does not render sort handle for array items'
        )
          .to.have.length(0)

        const $buttons = this.$(selectors.frost.button.input.enabled)

        expect(
          $buttons,
          'has three enabled buttons for removing items'
        )
          .to.have.length(3)

        expectButtonWithState($buttons.eq(0), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(1), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(2), {
          text: 'Remove'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('when sortable enabled', function () {
      beforeEach(function () {
        this.set('bunsenView', {
          cells: [
            {
              arrayOptions: {
                sortable: true
              },
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input for each array item'
        )
          .to.have.length(2)

        expect(
          findTextInputs({
            disabled: false
          }),
          'renders an enabled text input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.bunsen.array.sort.handle),
          'renders a sort handle for each array item'
        )
          .to.have.length(2)

        const $buttons = this.$(selectors.frost.button.input.enabled)

        expect(
          $buttons,
          'has three enabled buttons (1 for adding and 2 for removing)'
        )
          .to.have.length(3)

        expectButtonWithState($buttons.eq(0), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(1), {
          text: 'Remove'
        })

        expectButtonWithState($buttons.eq(2), {
          icon: 'round-add',
          text: 'Add foo'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })
  })
  describe('allows custom renderers on items', function () {
    setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            items: {
              type: 'string'
            },
            type: 'array'
          },
          bar: {
            items: {
              type: 'string'
            },
            type: 'array'
          }
        },
        type: 'object'
      },
      bunsenView: {
        type: 'form',
        version: '2.0',
        cells: [{
          model: 'foo',
          arrayOptions: {
            itemCell: {
              renderer: {
                name: 'select',
                recordsPath: 'bar'
              }
            }
          }
        }, {
          model: 'bar'
        }]
      },
      value: {
        foo: ['string 1', 'string 2', 'string 3'],
        bar: ['string 1', 'string 2', 'string 3']
      }
    })
    it('such as the select renderer', function () {
      expect(this.$('.frost-select')).to.have.length(3)
    })
  })
})
