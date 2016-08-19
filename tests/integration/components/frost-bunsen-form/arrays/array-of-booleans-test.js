import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | array of booleans',
  {
    integration: true
  },
  function () {
    describe('without initial value', function () {
      let props, sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()

        props = {
          bunsenModel: {
            properties: {
              foo: {
                items: {
                  type: 'boolean'
                },
                type: 'array'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          onChange: sandbox.spy(),
          onValidation: sandbox.spy()
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          disabled=disabled
          onChange=onChange
          onValidation=onValidation
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
          this.$(selectors.bunsen.renderer.boolean),
          'does not render any bunsen boolean inputs'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'does not render any checkbox inputs'
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
          'has an enabled button'
        )
          .to.have.length(1)

        expect(
          $button.find('.frost-icon-frost-round-add'),
          'button has add icon'
        )
          .to.have.length(1)

        expect(
          $button.text().trim(),
          'button has correct text'
        )
          .to.equal('Add foo')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when form explicitly enabled', function () {
        beforeEach(function () {
          this.set('disabled', false)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'does not render any bunsen boolean inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'does not render any checkbox inputs'
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
            'has an enabled button'
          )
            .to.have.length(1)

          expect(
            $button.find('.frost-icon-frost-round-add'),
            'button has add icon'
          )
            .to.have.length(1)

          expect(
            $button.text().trim(),
            'button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when form disabled', function () {
        beforeEach(function () {
          this.set('disabled', true)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'does not render any bunsen boolean inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'does not render any checkbox inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render any sort handles'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.disabled)

          expect(
            $button,
            'has a disabled button'
          )
            .to.have.length(1)

          expect(
            $button.find('.frost-icon-frost-round-add'),
            'button has add icon'
          )
            .to.have.length(1)

          expect(
            $button.text().trim(),
            'button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'renders collapsible handle'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'does not render a bunsen boolean input'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'does not render an enabled checkbox input'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.enabled)

          expect(
            $button,
            'has an enabled button for adding an item'
          )
            .to.have.length(1)

          expect(
            $button.text().trim(),
            'add button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

        describe('when user adds item', function () {
          beforeEach(function () {
            this.$(selectors.frost.button.input.enabled)
              .click()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.collapsible.handle),
              'renders collapsible handle'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.bunsen.renderer.boolean),
              'renders a bunsen boolean input for item'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.checkbox.input.enabled),
              'renders an enabled checkbox input for item'
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

            const $removeItemButton = $buttons.eq(0)

            expect(
              $removeItemButton.text().trim(),
              'remove item button has correct text'
            )
              .to.equal('Remove')

            const $addButton = $buttons.eq(1)

            expect(
              $addButton.text().trim(),
              'add button has correct text'
            )
              .to.equal('Add foo')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(2)

            const validationResult = props.onValidation.lastCall.args[0]

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

          describe('when user removes item', function () {
            beforeEach(function () {
              this.$(selectors.frost.button.input.enabled).first()
                .click()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.collapsible.handle),
                'renders collapsible handle'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.bunsen.renderer.boolean),
                'does not render a bunsen boolean input'
              )
                .to.have.length(0)

              expect(
                this.$(selectors.frost.checkbox.input.enabled),
                'does not render an enabled checkbox input'
              )
                .to.have.length(0)

              expect(
                this.$(selectors.bunsen.array.sort.handle),
                'does not render sort handle'
              )
                .to.have.length(0)

              const $button = this.$(selectors.frost.button.input.enabled)

              expect(
                $button,
                'has an enabled button for adding an item'
              )
                .to.have.length(1)

              expect(
                $button.text().trim(),
                'add button has correct text'
              )
                .to.equal('Add foo')

              expect(
                this.$(selectors.error),
                'does not have any validation errors'
              )
                .to.have.length(0)

              const validationResult = props.onValidation.lastCall.args[0]

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input for auto added item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input for auto added item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle for auto added array item'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.enabled)

          expect(
            $button,
            'has an enabled button for removing auto added item'
          )
            .to.have.length(1)

          expect(
            $button.text().trim(),
            'remove first item button has correct text'
          )
            .to.equal('Remove')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

        describe('when user checks checkbox', function () {
          beforeEach(function () {
            this.$(selectors.frost.checkbox.input.enabled)
              .trigger('click')
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.collapsible.handle),
              'does not render collapsible handle'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.boolean),
              'renders a bunsen boolean input for item plus one'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.checkbox.input.enabled),
              'renders an enabled checkbox input for item plus one'
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

            const $removeItem1Button = $buttons.eq(0)

            expect(
              $removeItem1Button.text().trim(),
              'remove first item button has correct text'
            )
              .to.equal('Remove')

            const $removeItem2Button = $buttons.eq(0)

            expect(
              $removeItem2Button.text().trim(),
              'remove second item button has correct text'
            )
              .to.equal('Remove')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(2)

            const validationResult = props.onValidation.lastCall.args[0]

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

    describe('with initial value', function () {
      let props, sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()

        props = {
          bunsenModel: {
            properties: {
              foo: {
                items: {
                  type: 'boolean'
                },
                type: 'array'
              }
            },
            type: 'object'
          },
          bunsenView: undefined,
          disabled: undefined,
          onChange: sandbox.spy(),
          onValidation: sandbox.spy(),
          value: {
            foo: [true, false]
          }
        }

        this.setProperties(props)

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          disabled=disabled
          onChange=onChange
          onValidation=onValidation
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

        expect(
          this.$(selectors.bunsen.renderer.boolean),
          'renders a bunsen boolean input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'renders an enabled checkbox input for each array item'
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
          'has three enabled buttons (1 for adding and 2 for removing)'
        )
          .to.have.length(3)

        const $removeItem1Button = $button.eq(0)

        expect(
          $removeItem1Button.text().trim(),
          'remove first item button has correct text'
        )
          .to.equal('Remove')

        const $removeItem2Button = $button.eq(1)

        expect(
          $removeItem2Button.text().trim(),
          'remove second item button has correct text'
        )
          .to.equal('Remove')

        const $addButton = $button.eq(2)

        expect(
          $addButton.find('.frost-icon-frost-round-add'),
          'add button has add icon'
        )
          .to.have.length(1)

        expect(
          $addButton.text().trim(),
          'add button has correct text'
        )
          .to.equal('Add foo')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when form explicitly enabled', function () {
        beforeEach(function () {
          this.set('disabled', false)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input for each array item'
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
            'has three enabled buttons (1 for adding and 2 for removing)'
          )
            .to.have.length(3)

          const $removeItem1Button = $button.eq(0)

          expect(
            $removeItem1Button.text().trim(),
            'remove first item button has correct text'
          )
            .to.equal('Remove')

          const $removeItem2Button = $button.eq(1)

          expect(
            $removeItem2Button.text().trim(),
            'remove second item button has correct text'
          )
            .to.equal('Remove')

          const $addButton = $button.eq(2)

          expect(
            $addButton.find('.frost-icon-frost-round-add'),
            'add button has add icon'
          )
            .to.have.length(1)

          expect(
            $addButton.text().trim(),
            'add button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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

      describe('when form disabled', function () {
        beforeEach(function () {
          this.set('disabled', true)
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.checkbox.input.disabled),
            'renders a disabled checkbox input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle for array items'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.disabled)

          expect(
            $button,
            'has three disabled buttons (1 for adding and 2 for removing)'
          )
            .to.have.length(3)

          const $removeItem1Button = $button.eq(0)

          expect(
            $removeItem1Button.text().trim(),
            'remove first item button has correct text'
          )
            .to.equal('Remove')

          const $removeItem2Button = $button.eq(1)

          expect(
            $removeItem2Button.text().trim(),
            'remove second item button has correct text'
          )
            .to.equal('Remove')

          const $addButton = $button.eq(2)

          expect(
            $addButton.find('.frost-icon-frost-round-add'),
            'add button has add icon'
          )
            .to.have.length(1)

          expect(
            $addButton.text().trim(),
            'add button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.collapsible.handle),
              'does not render collapsible handle'
            )
              .to.have.length(0)

            expect(
              this.$(selectors.bunsen.renderer.boolean),
              'renders a bunsen boolean input for each array item'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.checkbox.input.disabled),
              'renders a disabled checkbox input for each array item'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.bunsen.array.sort.handle),
              'renders a sort handle for each array item'
            )
              .to.have.length(2)

            // TODO: add test that ensures sort handles appear disabled

            const $button = this.$(selectors.frost.button.input.disabled)

            expect(
              $button,
              'has three enabled buttons (1 for adding and 2 for removing)'
            )
              .to.have.length(3)

            const $removeItem1Button = $button.eq(0)

            expect(
              $removeItem1Button.text().trim(),
              'remove first item button has correct text'
            )
              .to.equal('Remove')

            const $removeItem2Button = $button.eq(1)

            expect(
              $removeItem2Button.text().trim(),
              'remove second item button has correct text'
            )
              .to.equal('Remove')

            const $addButton = $button.eq(2)

            expect(
              $addButton.find('.frost-icon-frost-round-add'),
              'add button has add icon'
            )
              .to.have.length(1)

            expect(
              $addButton.text().trim(),
              'add button has correct text'
            )
              .to.equal('Add foo')

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(1)

            const validationResult = props.onValidation.lastCall.args[0]

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input for each array item plus one'
          )
            .to.have.length(3)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input for each array item plus one'
          )
            .to.have.length(3)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'does not render sort handle for array items'
          )
            .to.have.length(0)

          const $button = this.$(selectors.frost.button.input.enabled)

          expect(
            $button,
            'has three enabled buttons for removing items'
          )
            .to.have.length(3)

          const $removeItem1Button = $button.eq(0)

          expect(
            $removeItem1Button.text().trim(),
            'remove first item button has correct text'
          )
            .to.equal('Remove')

          const $removeItem2Button = $button.eq(1)

          expect(
            $removeItem2Button.text().trim(),
            'remove second item button has correct text'
          )
            .to.equal('Remove')

          const $removeItem3Button = $button.eq(2)

          expect(
            $removeItem3Button.text().trim(),
            'remove third item button has correct text'
          )
            .to.equal('Remove')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.array.sort.handle),
            'renders a sort handle for each array item'
          )
            .to.have.length(2)

          const $button = this.$(selectors.frost.button.input.enabled)

          expect(
            $button,
            'has three enabled buttons (1 for adding and 2 for removing)'
          )
            .to.have.length(3)

          const $removeItem1Button = $button.eq(0)

          expect(
            $removeItem1Button.text().trim(),
            'remove first item button has correct text'
          )
            .to.equal('Remove')

          const $removeItem2Button = $button.eq(1)

          expect(
            $removeItem2Button.text().trim(),
            'remove second item button has correct text'
          )
            .to.equal('Remove')

          const $addButton = $button.eq(2)

          expect(
            $addButton.find('.frost-icon-frost-round-add'),
            'add button has add icon'
          )
            .to.have.length(1)

          expect(
            $addButton.text().trim(),
            'add button has correct text'
          )
            .to.equal('Add foo')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

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
  }
)
