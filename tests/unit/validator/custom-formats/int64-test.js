import {expect} from 'chai'
import {describe, it} from 'mocha'
import int64 from 'ember-frost-bunsen/validator/custom-formats/int64'

describe('int64 format', () => {
  it('returns false when value is undefined', () => {
    expect(int64(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(int64(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(int64('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(int64({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(int64([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(int64(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(int64(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(int64(Infinity)).to.be.false
  })

  it('returns true when value is an integer', () => {
    expect(int64(0)).to.be.true
  })
})
