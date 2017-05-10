/**
 * Common helper for testing format validationResult
 * NOTE: These specs have lots of expect() calls in a single it() for performance reasons
 */
import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {afterEach, before, beforeEach, describe, it} from 'mocha'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {
  expectTextInputWithState,
  fillIn,
  findTextInputs,
  focusout
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

export default function (format, invalidValues, validValues, focus = false) {
  const describeFunc = focus ? describe.only : describe

  describeFunc(`Integration: Component / frost-bunsen-form / format / ${format}`, function () {
    before(function () {
      this.timeout(3000) // Sometimes 2 seconds isn't enoguh for the CI
    })

    setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            format: format,
            type: 'string'
          }
        },
        type: 'object'
      }
    })

    it('renders as expected', function () {
      expect(findTextInputs())
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

          fillIn('bunsenForm-foo-input', input)

          return wait()
        })

        afterEach(function () {
          validationResult = null
          value = null
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
            focusout('bunsenForm-foo-input')
            return wait()
          })

          it('renders as expected', function () {
            expect(this.$(selectors.frost.text.input.enabled).val())
              .msg('input maintains user input value')
              .to.equal(input)

            expectBunsenInputToHaveError(
              'foo',
              `Object didn't pass validation for format ${format}: ${input}`
            )
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

          fillIn('bunsenForm-foo-input', input)

          return wait()
        })

        afterEach(function () {
          validationResult = null
          value = null
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
            .not.to.equal(undefined)

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

          expectTextInputWithState('bunsenForm-foo-input', {
            placeholder: '',
            value: input
          })
        })

        describe('when user removes focus from input', function () {
          beforeEach(function () {
            focusout('bunsenForm-foo-input')
            return wait()
          })

          it('renders as expected', function () {
            expectTextInputWithState('bunsenForm-foo-input', {
              placeholder: '',
              value: input
            })

            expectBunsenInputNotToHaveError('foo')
          })
        })
      })
    })
  })
}
