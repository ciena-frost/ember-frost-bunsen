import {expect} from 'chai'
import {describe, it} from 'mocha'
import hexString from 'ember-frost-bunsen/validator/custom-formats/hex-string'

describe('hex-string format', () => {
  it('returns false when value is undefined', () => {
    expect(hexString(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(hexString(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(hexString({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(hexString([])).to.be.false
  })

  it('returns false when value is an integer', () => {
    expect(hexString(1)).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(hexString(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(hexString(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(hexString(Infinity)).to.be.false
  })

  it('returns false when value is not valid', () => {
    [
      'a',
      '1',
      'a1:',
      'a1:b',
      'g1'
    ]
      .forEach((value) => {
        expect(hexString(value)).to.be.false
      })
  })

  it('returns true when value is valid', () => {
    [
      'a1',
      'a1:b2',
      'f1'
    ]
      .forEach((value) => {
        expect(hexString(value)).to.be.true
      })
  })
})
