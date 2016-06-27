import {expect} from 'chai'
import {describe, it} from 'mocha'
import int32 from 'ember-frost-bunsen/validator/custom-formats/int32'

describe('int format', () => {
  it('returns false when value is undefined', () => {
    expect(int32(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(int32(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(int32('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(int32({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(int32([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(int32(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(int32(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(int32(Infinity)).to.be.false
  })

  it('returns true when value is an integer', () => {
    expect(int32(0)).to.be.true
  })

  it('returns false when value < -2147483648', () => {
    expect(int32(-2147483649)).to.be.false
  })

  it('returns true when -2147483648 <= value <= 2147483647', () => {
    expect(int32(-2147483648)).to.be.true
    expect(int32(2147483647)).to.be.true
  })

  it('returns false when value > 2147483647', () => {
    expect(int32(2147483648)).to.be.false
  })
})
