import {expect} from 'chai'
import Ember from 'ember'
const {Logger} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

export default function (format, invalidValues, validValues) {
  describeComponent(
    'frost-bunsen-form',
    `Integration: Component | frost-bunsen-form | format | ${format}`,
    {
      integration: true
    },
    function () {
      let sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()
        sandbox.stub(Logger, 'warn', () => {})

        this.setProperties({
          bunsenModel: {
            properties: {
              foo: {
                format: format,
                type: 'string'
              }
            },
            type: 'object'
          },
          onChange: sandbox.spy(),
          onValidation: sandbox.spy()
        })

        this.render(hbs`{{frost-bunsen-form
          bunsenModel=bunsenModel
          onChange=onChange
          onValidation=onValidation
        }}`)
      })

      afterEach(function () {
        sandbox.restore()
      })

      it('renders as expected', function () {
        expect(
          this.$('input[type="text"]'),
          'renders a text input'
        )
          .to.have.length(1)

        expect(
          this.$('.error'),
          'does not have any validation errors'
        )
          .to.have.length(0)
      })

      invalidValues.forEach((input) => {
        describe(`when "${input}" entered into input`, function () {
          let validationResult, value

          beforeEach(function () {
            this.setProperties({
              onChange (formValue) {
                value = formValue
              },

              onValidation (formValidationResult) {
                validationResult = formValidationResult
              }
            })

            this.$('input[type="text"]')
              .focus()
              .val(input)
              .trigger('input')
          })

          it('functions as expected', function () {
            expect(
              value,
              'provides consumer correct value via onChange() property'
            )
              .to.eql({
                foo: input
              })

            expect(
              validationResult.errors.length,
              'informs consumer of one error'
            )
              .to.equal(1)

            expect(
              validationResult.warnings.length,
              'informs consumer of zero warnings'
            )
              .to.equal(0)

            const error = validationResult.errors[0]

            expect(
              error.message,
              'error has correct message'
            )
              .to.equal(`Object didn't pass validation for format ${format}: ${input}`)

            expect(
              error.path,
              'error has correct path'
            )
              .to.equal('#/foo')

            expect(
              this.$('input[type="text"]').val(),
              'input maintains user input value'
            )
              .to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$('input[type="text"]').focusout()
            })

            it('renders as expected', function () {
              expect(
                this.$('input[type="text"]').val(),
                'input maintains user input value'
              )
                .to.equal(input)

              expect(
                this.$('.frost-text.error'),
                'adds error class to input'
              )
                .to.have.length(1)

              const actual = this.$('.frost-field .error:not(.frost-text)').text().trim()
              const expected = `Object didn't pass validation for format ${format}: ${input}`

              expect(
                actual,
                'presents user with validation error message'
              )
                .to.equal(expected)
            })
          })
        })
      })

      validValues.forEach((input) => {
        describe(`when "${input}" entered into input`, function () {
          let validationResult, value

          beforeEach(function () {
            this.setProperties({
              onChange (formValue) {
                value = formValue
              },

              onValidation (formValidationResult) {
                validationResult = formValidationResult
              }
            })

            this.$('input[type="text"]')
              .focus()
              .val(input)
              .trigger('input')
          })

          it('functions as expected', function () {
            expect(
              value,
              'provides consumer correct value via onChange() property'
            )
              .to.eql({
                foo: input
              })

            expect(
              validationResult,
              'does not provide consumer with validation results via onValidation() property'
            )
              .to.be.undefined

            expect(
              this.$('input[type="text"]').val(),
              'input maintains user input value'
            )
              .to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$('input[type="text"]').focusout()
            })

            it('renders as expected', function () {
              expect(
                this.$('input[type="text"]').val(),
                'input maintains user input value'
              )
                .to.equal(input)

              expect(
                this.$('.frost-text').hasClass('error'),
                'does not add error class to input'
              )
                .to.be.false

              expect(
                this.$('.frost-field .error'),
                'does not present user with validation error message'
              )
                .to.have.length(0)
            })
          })
        })
      })
    }
  )
}
