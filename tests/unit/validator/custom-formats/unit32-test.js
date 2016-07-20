import {expect} from 'chai'
import {describe, it} from 'mocha'
import uint32 from 'ember-frost-bunsen/validator/custom-formats/uint32'

describe('unit32 format', () => {
  it('returns false when value is undefined', () => {
    expect(uint32(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(uint32(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(uint32('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(uint32({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(uint32([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(uint32(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(uint32(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(uint32(Infinity)).to.be.false
  })

  it('returns true when value is an integer', () => {
    expect(uint32(0)).to.be.true
  })

  it('returns false when value < 0', () => {
    expect(uint32(-1)).to.be.false
    expect(uint32('-1')).to.be.false
  })

  it('returns true when 0 <= value <= 4294967295', () => {
    expect(uint32(0)).to.be.true
    expect(uint32('0')).to.be.true
    expect(uint32(4294967295)).to.be.true
    expect(uint32('4294967295')).to.be.true
  })

  it('returns false when value > 4294967295', () => {
    expect(uint32(4294967296)).to.be.false
    expect(uint32('4294967296')).to.be.false
  })
})
