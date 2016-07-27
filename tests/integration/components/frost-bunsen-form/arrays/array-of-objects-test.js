import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | array of objects',
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
                  properties: {
                    bar: {
                      type: 'string'
                    },
                    baz: {
                      type: 'number'
                    }
                  },
                  type: 'object'
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
          this.$(selectors.bunsen.renderer.text),
          'does not render any bunsen text inputs'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.renderer.number),
          'does not render any bunsen number inputs'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.frost.text.input.enabled),
          'does not render any text inputs'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.frost.number.input.enabled),
          'does not render any number inputs'
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
            this.$(selectors.bunsen.renderer.text),
            'does not render any bunsen text inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'does not render any bunsen number inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'does not render any text inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'does not render any number inputs'
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
            this.$(selectors.bunsen.renderer.text),
            'does not render any bunsen text inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'does not render any bunsen number inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'does not render any text inputs'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'does not render any number inputs'
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

      describe('when autoAdd enabled', function () {
        beforeEach(function () {
          this.set('bunsenView', {
            cellDefinitions: {
              foo: {
                children: [
                  {
                    model: 'bar'
                  },
                  {
                    model: 'baz'
                  }
                ]
              }
            },
            cells: [
              {
                arrayOptions: {
                  autoAdd: true,
                  itemCell: {
                    extends: 'foo'
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for auto added item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'renders a bunsen number input for auto added item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input for auto added item'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'renders an enabled number input for auto added item'
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

        describe('when user inputs value', function () {
          beforeEach(function () {
            this.$(selectors.frost.text.input.enabled)
              .val('bar')
              .trigger('input')
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input for item plus one'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.bunsen.renderer.number),
              'renders a bunsen number input for item plus one'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.text.input.enabled),
              'renders an enabled text input for item plus one'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.number.input.enabled),
              'renders an enabled number input for item plus one'
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

          describe('when user clears input', function () {
            beforeEach(function () {
              this.$(selectors.frost.text.input.enabled).first()
                .val('')
                .trigger('input')
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.bunsen.renderer.text),
                'renders a bunsen text input for auto added item'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.bunsen.renderer.number),
                'renders a bunsen number input for auto added item'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.frost.text.input.enabled),
                'renders an enabled text input for auto added item'
              )
                .to.have.length(1)

              expect(
                this.$(selectors.frost.number.input.enabled),
                'renders an enabled number input for auto added item'
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

              const validationResult = props.onValidation.lastCall.args[0]

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
                    bar: {
                      type: 'string'
                    },
                    baz: {
                      type: 'number'
                    }
                  },
                  type: 'object'
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
            foo: [
              {
                bar: 'bar'
              },
              {
                baz: 1
              }
            ]
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
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.bunsen.renderer.number),
          'renders a bunsen number input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.frost.text.input.enabled),
          'renders an enabled text input for each array item'
        )
          .to.have.length(2)

        expect(
          this.$(selectors.frost.number.input.enabled),
          'renders an enabled number input for each array item'
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'renders a bunsen number input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'renders an enabled number input for each array item'
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'renders a bunsen number input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.text.input.disabled),
            'renders a disabled text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.number.input.disabled),
            'renders a disabled number input for each array item'
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
              cellDefinitions: {
                foo: {
                  children: [
                    {
                      model: 'bar'
                    },
                    {
                      model: 'baz'
                    }
                  ]
                }
              },
              cells: [
                {
                  arrayOptions: {
                    sortable: true,
                    itemCell: {
                      extends: 'foo'
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
              this.$(selectors.bunsen.renderer.text),
              'renders a bunsen text input for each array item'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.bunsen.renderer.number),
              'renders a bunsen number input for each array item'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.text.input.disabled),
              'renders a disabled text input for each array item'
            )
              .to.have.length(2)

            expect(
              this.$(selectors.frost.number.input.disabled),
              'renders a disabled number input for each array item'
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
            cellDefinitions: {
              foo: {
                children: [
                  {
                    model: 'bar'
                  },
                  {
                    model: 'baz'
                  }
                ]
              }
            },
            cells: [
              {
                arrayOptions: {
                  autoAdd: true,
                  itemCell: {
                    extends: 'foo'
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item plus one'
          )
            .to.have.length(3)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'renders a bunsen number input for each array item plus one'
          )
            .to.have.length(3)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input for each array item plus one'
          )
            .to.have.length(3)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'renders an enabled number input for each array item plus one'
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
            cellDefinitions: {
              foo: {
                children: [
                  {
                    model: 'bar'
                  },
                  {
                    model: 'baz'
                  }
                ]
              }
            },
            cells: [
              {
                arrayOptions: {
                  sortable: true,
                  itemCell: {
                    extends: 'foo'
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.bunsen.renderer.number),
            'renders a bunsen number input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input for each array item'
          )
            .to.have.length(2)

          expect(
            this.$(selectors.frost.number.input.enabled),
            'renders an enabled number input for each array item'
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
