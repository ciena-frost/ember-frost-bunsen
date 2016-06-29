import _ from 'lodash'
import {expect} from 'chai'
import {describe, it} from 'mocha'
import bgpAs from 'ember-frost-bunsen/validator/custom-formats/bgp-as'

describe('bgp-as format', () => {
  it('returns false when value is undefined', () => {
    expect(bgpAs(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(bgpAs(null)).to.be.false
  })

  it('returns false when value is a string', () => {
    expect(bgpAs('test')).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(bgpAs({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(bgpAs([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(bgpAs(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(bgpAs(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(bgpAs(Infinity)).to.be.false
  })

  it('returns false when value < 0', () => {
    expect(bgpAs(-1)).to.be.false
    expect(bgpAs('-1')).to.be.false
  })

  it('returns false when value = 0', () => {
    expect(bgpAs(0)).to.be.false
    expect(bgpAs('0')).to.be.false
  })

  it('returns true when 1 <= value <= 65534', () => {
    _.range(1, 65534).forEach((value) => {
      expect(bgpAs(value)).to.be.true
      expect(bgpAs(`${value}`)).to.be.true
    })
  })

  it('returns false when value = 65535', () => {
    expect(bgpAs(65535)).to.be.false
    expect(bgpAs('65535')).to.be.false
  })

  it('returns true when 65536 <= value <= 4294967294', () => {
    expect(bgpAs(65536)).to.be.true
    expect(bgpAs('65536')).to.be.true
    expect(bgpAs(4294967294)).to.be.true
    expect(bgpAs('4294967294')).to.be.true
  })

  it('returns false when value = 4294967295', () => {
    expect(bgpAs(4294967295)).to.be.false
    expect(bgpAs('4294967295')).to.be.false
  })

  it('returns false when value > 4294967295', () => {
    expect(bgpAs(4294967296)).to.be.false
    expect(bgpAs('4294967296')).to.be.false
  })
})
