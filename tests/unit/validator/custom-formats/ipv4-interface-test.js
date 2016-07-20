import {expect} from 'chai'
import {describe, it} from 'mocha'
import ipv4Interface from 'ember-frost-bunsen/validator/custom-formats/ipv4-interface'

describe('ipv4-interface format', () => {
  it('returns false when value is undefined', () => {
    expect(ipv4Interface(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(ipv4Interface(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(ipv4Interface({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(ipv4Interface([])).to.be.false
  })

  it('returns false when value is an integer', () => {
    expect(ipv4Interface(1)).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(ipv4Interface(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(ipv4Interface(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(ipv4Interface(Infinity)).to.be.false
  })

  it('returns false when network mask is missing', () => {
    expect(ipv4Interface('100.101.102.103')).to.be.false
  })

  it('returns false when ip address does not consist of four octets', () => {
    expect(ipv4Interface('100.101.102/0')).to.be.false
  })

  it('returns false when octets contain non-numeric characters', () => {
    expect(ipv4Interface('100a.101.102.103/0')).to.be.false
    expect(ipv4Interface('100.101a.102.103/0')).to.be.false
    expect(ipv4Interface('100.101.102a.103/0')).to.be.false
    expect(ipv4Interface('100.101.102.103a/0')).to.be.false
  })

  it('returns false when octets contain negative numbers', () => {
    expect(ipv4Interface('-100.101.102.103/0')).to.be.false
    expect(ipv4Interface('100.-101.102.103/0')).to.be.false
    expect(ipv4Interface('100.101.-102.103/0')).to.be.false
    expect(ipv4Interface('100.101.102.-103/0')).to.be.false
  })

  it('returns false when octets contain numbers > 255', () => {
    expect(ipv4Interface('256.101.102.103/0')).to.be.false
    expect(ipv4Interface('100.256.102.103/0')).to.be.false
    expect(ipv4Interface('100.101.256.103/0')).to.be.false
    expect(ipv4Interface('100.101.102.256/0')).to.be.false
  })

  it('returns false when first octet contains numbers > 253', () => {
    expect(ipv4Interface('254.0.0.0/0')).to.be.false
    expect(ipv4Interface('255.0.0.0/0')).to.be.false
  })

  it('returns false when invalid IPv4 interface', () => {
    expect(ipv4Interface('192.168.0.0/16')).to.be.false
    expect(ipv4Interface('192.168.255.255/16')).to.be.false
  })

  it('returns true when valid IPv4 interface', () => {
    expect(ipv4Interface('192.168.128.0/16')).to.be.true
    expect(ipv4Interface('192.168.0.1/16')).to.be.true
  })
})
