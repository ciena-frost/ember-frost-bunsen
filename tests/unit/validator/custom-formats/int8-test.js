import _ from 'lodash'
import {expect} from 'chai'
import {describe, it} from 'mocha'
import int8 from 'ember-frost-bunsen/validator/custom-formats/int8'

describe('int8 format', () => {
  it('returns false when value is undefined', () => {
    expect(int8(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(int8(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(int8('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(int8({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(int8([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(int8(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(int8(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(int8(Infinity)).to.be.false
  })

  it('returns false when value < -128', () => {
    expect(int8(-129)).to.be.false
  })

  it('returns true when -128 <= value <= 127', () => {
    _.range(-128, 127).forEach((value) => {
      expect(int8(value)).to.be.true
    })
  })

  it('returns false when value > 127', () => {
    expect(int8(128)).to.be.false
  })
})
