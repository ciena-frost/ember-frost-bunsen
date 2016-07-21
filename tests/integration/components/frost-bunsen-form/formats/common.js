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

      it('renders a text input', function () {
        expect(this.$('input[type="text"]')).to.have.length(1)
      })

      it('does not have any validation errors', function () {
        expect(this.$('.error')).to.have.length(0)
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

          it('provides consumer correct value via onChange() property', function () {
            expect(value).to.eql({
              foo: input
            })
          })

          it('provides consumer correct validation results via onValidation() property', function () {
            expect(validationResult.errors.length).to.equal(1)
            const error = validationResult.errors[0]
            expect(error.message).to.equal(`Object didn't pass validation for format ${format}: ${input}`)
            expect(error.path).to.equal('#/foo')
          })

          it('input maintains user input value', function () {
            expect(this.$('input[type="text"]').val()).to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$('input[type="text"]').focusout()
            })

            it('input maintains user input value', function () {
              expect(this.$('input[type="text"]').val()).to.equal(input)
            })

            it('adds error class to input', function () {
              expect(this.$('.frost-text.error')).to.have.length(1)
            })

            it('presents user with validation error message', function () {
              const actual = this.$('.frost-field .error:not(.frost-text)').text().trim()
              const expected = `Object didn't pass validation for format ${format}: ${input}`
              expect(actual).to.equal(expected)
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

          it('provides consumer correct value via onChange() property', function () {
            expect(value).to.eql({
              foo: input
            })
          })

          it('does not provide consumer with validation results via onValidation() property', function () {
            expect(validationResult).to.be.undefined
          })

          it('input maintains user input value', function () {
            expect(this.$('input[type="text"]').val()).to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$('input[type="text"]').focusout()
            })

            it('input maintains user input value', function () {
              expect(this.$('input[type="text"]').val()).to.equal(input)
            })

            it('does not add error class to input', function () {
              expect(this.$('.frost-text').hasClass('error')).to.be.false
            })

            it('does not present user with validation error message', function () {
              expect(this.$('.frost-field .error')).to.have.length(0)
            })
          })
        })
      })
    }
  )
}
