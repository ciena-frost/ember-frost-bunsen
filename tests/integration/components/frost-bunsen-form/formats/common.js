/**
 * Common helper for testing format validationResult
 * NOTE: These specs have lots of expect() calls in a single it() for performance reasons
 */
import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

export default function (format, invalidValues, validValues, focus = false) {
  const describeFunc = focus ? describeComponent.only : describeComponent
  describeFunc(
    'frost-bunsen-form',
    `Integration: Component | frost-bunsen-form | format | ${format}`,
    {
      integration: true
    },
    function () {
      let sandbox

      beforeEach(function () {
        sandbox = sinon.sandbox.create()

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
        expect(this.$(selectors.frost.text.input.enabled))
          .msg('renders a text input')
          .to.have.length(1)

        expect(this.$(selectors.error))
          .msg('does not have any validation errors')
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

            this.$(selectors.frost.text.input.enabled)
              .focus()
              .val(input)
              .trigger('input')
          })

          it('functions as expected', function () {
            expect(value)
              .msg('provides consumer correct value via onChange() property')
              .to.eql({
                foo: input
              })

            expect(validationResult.errors.length)
              .msg('informs consumer of one error')
              .to.equal(1)

            expect(validationResult.warnings.length)
              .msg('informs consumer of zero warnings')
              .to.equal(0)

            const error = validationResult.errors[0]

            expect(error.message)
              .msg('error has correct message')
              .to.equal(`Object didn't pass validation for format ${format}: ${input}`)

            expect(error.path)
              .msg('error has correct path')
              .to.equal('#/foo')

            expect(this.$(selectors.frost.text.input.enabled).val())
              .msg('input maintains user input value')
              .to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$(selectors.frost.text.input.enabled).focusout()
            })

            it('renders as expected', function () {
              expect(this.$(selectors.frost.text.input.enabled).val())
                .msg('input maintains user input value')
                .to.equal(input)

              expect(this.$(selectors.frost.text.error))
                .msg('adds error class to input')
                .to.have.length(1)

              const actual = this.$(selectors.frost.not.text.error).text().trim()
              const expected = `Object didn't pass validation for format ${format}: ${input}`

              expect(actual)
                .msg('presents user with validation error message')
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

            this.$(selectors.frost.text.input.enabled)
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
              'provides consumer with validation results via onValidation() property'
            )
              .to.be.defined

            expect(
              validationResult.errors,
              'has no validation errors'
            )
              .to.eql([])

            expect(
              validationResult.warnings,
              'has no validation warnings'
            )
              .to.eql([])

            expect(
              this.$(selectors.frost.text.input.enabled).val(),
              'input maintains user input value'
            )
              .to.equal(input)
          })

          describe('when user removes focus from input', function () {
            beforeEach(function () {
              this.$(selectors.frost.text.input.enabled).focusout()
            })

            it('renders as expected', function () {
              expect(
                this.$(selectors.frost.text.input.enabled).val(),
                'input maintains user input value'
              )
                .to.equal(input)

              expect(
                this.$(selectors.frost.text.wrapper).hasClass('error'),
                'does not add error class to input'
              )
                .to.be.false

              expect(
                this.$(selectors.frost.error),
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
