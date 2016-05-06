import {expect} from 'chai'
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {
  integerRegex,
  ipAddressRangeRegex,
  translateMissingRequiredPropertyErrors,
  translateRegexErrors
} from 'ember-frost-bunsen/validator/value'

describe('value', function () {
  describe('translateMissingRequiredPropertyErrors()', function () {
    let nonRequiredError, requiredError1, requiredError2

    beforeEach(function () {
      nonRequiredError = {
        message: 'This is not a real phone number.',
        path: '#/phone'
      }

      requiredError1 = {
        message: 'Missing required property: first',
        path: '#/name'
      }

      requiredError2 = {
        message: 'Missing required property: last',
        path: '#/name/'
      }
    })

    it('translates missing required property error when path does not have trailing slash', function () {
      const errors = [requiredError1]
      translateMissingRequiredPropertyErrors(errors)
      expect(errors.length).to.eq(1)
      expect(errors[0]).to.eql({
        isRequiredError: true,
        message: 'Field is required.',
        path: '#/name/first'
      })
    })

    it('translates missing required property error when path has trailing slash', function () {
      const errors = [requiredError2]
      translateMissingRequiredPropertyErrors(errors)
      expect(errors.length).to.eq(1)
      expect(errors[0]).to.eql({
        isRequiredError: true,
        message: 'Field is required.',
        path: '#/name/last'
      })
    })

    it('does not translate non-missing required property error', function () {
      const errors = [nonRequiredError]
      translateMissingRequiredPropertyErrors(errors)
      expect(errors.length).to.eq(1)
      expect(errors[0]).to.eql(nonRequiredError)
    })

    it('processes error arrays containing required and non-required errors', function () {
      const errors = [nonRequiredError, requiredError1]
      translateMissingRequiredPropertyErrors(errors)
      expect(errors.length).to.eq(2)
      expect(errors[0]).to.eql(nonRequiredError)
      expect(errors[1]).to.eql({
        isRequiredError: true,
        message: 'Field is required.',
        path: '#/name/first'
      })
    })
  })

  describe('translateRegexErrors()', function () {
    let errors

    beforeEach(function () {
      errors = [
        {
          message: `String does not match pattern ${integerRegex}: foo-bar`
        },
        {
          message: `String does not match pattern ${ipAddressRangeRegex}: 192.168.1.2/a`
        }
      ]

      translateRegexErrors(errors)
    })

    it('translates integer regex error', function () {
      expect(errors[0].message).to.be.eq('String does not match pattern for an integer: foo-bar')
    })

    it('translates ip range regex error', function () {
      expect(errors[1].message).to.be.eq('String does not match pattern for an IP address: 192.168.1.2/a')
    })
  })
})
