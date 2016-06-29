import {expect} from 'chai'
import {describe, it} from 'mocha'
import ipv4Prefix from 'ember-frost-bunsen/validator/custom-formats/ipv4-prefix'

describe('ipv4-prefix format', () => {
  it('returns false when value is undefined', () => {
    expect(ipv4Prefix(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(ipv4Prefix(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(ipv4Prefix({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(ipv4Prefix([])).to.be.false
  })

  it('returns false when value is an integer', () => {
    expect(ipv4Prefix(1)).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(ipv4Prefix(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(ipv4Prefix(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(ipv4Prefix(Infinity)).to.be.false
  })

  it('returns false when network mask is missing', () => {
    expect(ipv4Prefix('100.101.102.103')).to.be.false
  })

  it('returns false when ip address does not consist of four octets', () => {
    expect(ipv4Prefix('100.101.102/0')).to.be.false
  })

  it('returns false when octets contain non-numeric characters', () => {
    expect(ipv4Prefix('100a.101.102.103/0')).to.be.false
    expect(ipv4Prefix('100.101a.102.103/0')).to.be.false
    expect(ipv4Prefix('100.101.102a.103/0')).to.be.false
    expect(ipv4Prefix('100.101.102.103a/0')).to.be.false
  })

  it('returns false when octets contain negative numbers', () => {
    expect(ipv4Prefix('-100.101.102.103/0')).to.be.false
    expect(ipv4Prefix('100.-101.102.103/0')).to.be.false
    expect(ipv4Prefix('100.101.-102.103/0')).to.be.false
    expect(ipv4Prefix('100.101.102.-103/0')).to.be.false
  })

  it('returns false when octets contain numbers > 255', () => {
    expect(ipv4Prefix('256.101.102.103/0')).to.be.false
    expect(ipv4Prefix('100.256.102.103/0')).to.be.false
    expect(ipv4Prefix('100.101.256.103/0')).to.be.false
    expect(ipv4Prefix('100.101.102.256/0')).to.be.false
  })

  it('returns false when first octet contains numbers > 253', () => {
    expect(ipv4Prefix('254.0.0.0/0')).to.be.false
    expect(ipv4Prefix('255.0.0.0/0')).to.be.false
  })

  it('returns false when invalid IPv4 prefix', () => {
    expect(ipv4Prefix('192.168.128.0/16')).to.be.false
  })

  it('returns true when valid IPv4 prefix', () => {
    expect(ipv4Prefix('192.168.0.0/16')).to.be.true
  })
})
