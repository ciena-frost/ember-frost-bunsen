const expect = chai.expect
import {describe, it} from 'mocha'
import {getModelPath} from 'ember-frost-bunsen/utils'

describe('utils', () => {
  describe('getModelPath()', () => {
    it('handles top-level properties', () => {
      expect(getModelPath('fooBar')).to.be.equal('properties.fooBar')
    })

    it('handles nested properties', () => {
      expect(getModelPath('foo.bar.baz')).to.be.equal('properties.foo.properties.bar.properties.baz')
    })

    it('handles invalid trailing dot reference', () => {
      expect(getModelPath('foo.bar.')).to.be.equal(undefined)
    })

    it('handles invalid leading dot reference', () => {
      expect(getModelPath('.foo.bar')).to.be.equal(undefined)
    })

    it('handles model with dependency', () => {
      const expected = 'dependencies.useEft.properties.routingNumber'
      expect(getModelPath('routingNumber', 'useEft')).to.be.equal(expected)
    })

    it('handles model with dependency', () => {
      const expected = 'properties.paymentInfo.dependencies.useEft.properties.routingNumber'
      expect(getModelPath('paymentInfo.routingNumber', 'paymentInfo.useEft')).to.be.equal(expected)
    })
  })
})
