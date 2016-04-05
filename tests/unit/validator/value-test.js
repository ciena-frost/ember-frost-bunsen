const expect = chai.expect
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {
  integerRegex,
  ipAddressRangeRegex,
  translateRegexErrors
} from 'ember-frost-bunsen/validator/value'

describe('value', function () {
  let errors

  describe('translateRegexErrors()', function () {
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
