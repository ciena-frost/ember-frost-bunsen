import _ from 'lodash'
import {expect} from 'chai'
import {describe, it} from 'mocha'
import vlanId from 'ember-frost-bunsen/validator/custom-formats/vlan-id'

describe('vlan-id format', () => {
  it('returns false when value is undefined', () => {
    expect(vlanId(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(vlanId(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(vlanId('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(vlanId({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(vlanId([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(vlanId(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(vlanId(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(vlanId(Infinity)).to.be.false
  })

  it('returns false when value < 0', () => {
    expect(vlanId(-1)).to.be.false
    expect(vlanId('-1')).to.be.false
  })

  it('returns false when value = 0', () => {
    expect(vlanId(0)).to.be.false
    expect(vlanId('0')).to.be.false
  })

  it('returns true when 1 <= value <= 4094', () => {
    _.range(1, 4094).forEach((value) => {
      expect(vlanId(value)).to.be.true
      expect(vlanId(`${value}`)).to.be.true
    })
  })

  it('returns false when value > 4094', () => {
    expect(vlanId(4095)).to.be.false
    expect(vlanId('4095')).to.be.false
  })
})
