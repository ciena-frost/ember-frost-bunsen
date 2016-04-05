const expect = chai.expect
import {beforeEach, describe, it} from 'mocha'
import {aggregateResults, validateRequiredAttribute} from 'ember-frost-bunsen/validator/utils'

describe('utils', function () {
  describe('validateRequiredAttribute()', function () {
    let object, result

    describe('when valid', function () {
      beforeEach(function () {
        object = {
          foo: 'bar'
        }
        result = validateRequiredAttribute(object, 'path.to.object', 'foo', ['bar', 'baz'])
      })

      it('validates', function () {
        expect(result).to.eql({
          errors: [],
          warnings: []
        })
      })
    })

    describe('when attribute is missing', function () {
      beforeEach(function () {
        object = {
          bar: 'baz'
        }
        result = validateRequiredAttribute(object, 'path.to.object', 'foo', ['bar', 'baz'])
      })

      it('returns appropriate error', function () {
        expect(result.errors).to.have.length(1)
        expect(result.errors).to.containSubset([{
          message: 'Missing required attribute "foo"',
          path: 'path.to.object'
        }])
      })
    })

    describe('when attribute is invalid', function () {
      beforeEach(function () {
        object = {
          foo: 'baz'
        }
        result = validateRequiredAttribute(object, 'path.to.object', 'foo', ['bar'])
      })

      it('returns appropriate error', function () {
        expect(result.errors).to.containSubset([
          {path: 'path.to.object', message: 'Invalid value "baz" for "foo" Valid options are ["bar"]'}
        ])
      })
    })
  })

  describe('aggregateResults()', function () {
    let results, result
    beforeEach(function () {
      results = [
        {
          errors: [],
          warnings: ['warning-1', 'warning-2']
        },
        {
          errors: ['error-1', 'error-2'],
          warnings: []
        },
        {
          errors: [],
          warnings: ['warning-3']
        }
      ]

      result = aggregateResults(results)
    })

    it('properly aggregates everything', function () {
      expect(result).to.containSubset({
        errors: ['error-1', 'error-2'],
        warnings: ['warning-1', 'warning-2', 'warning-3']
      })
    })
  })
})
