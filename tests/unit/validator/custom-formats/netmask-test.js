import {expect} from 'chai'
import {describe, it} from 'mocha'
import netmask from 'ember-frost-bunsen/validator/custom-formats/netmask'

describe('ipv4-address format', () => {
  it('returns false when value is undefined', () => {
    expect(netmask(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(netmask(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(netmask({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(netmask([])).to.be.false
  })

  it('returns false when value is an integer', () => {
    expect(netmask(1)).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(netmask(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(netmask(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(netmask(Infinity)).to.be.false
  })

  it('returns false when value does not consist of four octets', () => {
    expect(netmask('100.101.102')).to.be.false
  })

  it('returns false when octets contain non-numeric characters', () => {
    expect(netmask('100a.101.102.103')).to.be.false
    expect(netmask('100.101a.102.103')).to.be.false
    expect(netmask('100.101.102a.103')).to.be.false
    expect(netmask('100.101.102.103a')).to.be.false
  })

  it('returns false when octets contain negative numbers', () => {
    expect(netmask('-100.101.102.103')).to.be.false
    expect(netmask('100.-101.102.103')).to.be.false
    expect(netmask('100.101.-102.103')).to.be.false
    expect(netmask('100.101.102.-103')).to.be.false
  })

  it('returns false when octets contain numbers > 255', () => {
    expect(netmask('256.101.102.103')).to.be.false
    expect(netmask('100.256.102.103')).to.be.false
    expect(netmask('100.101.256.103')).to.be.false
    expect(netmask('100.101.102.256')).to.be.false
  })

  it('returns false when invalid netmask', () => {
    expect(netmask('127.0.0.1')).to.be.false
    expect(netmask('255.255.255.144')).to.be.false
  })

  it('returns true when valid netmask', () => {
    expect(netmask('0.0.0.0')).to.be.true
    expect(netmask('255.255.255.0')).to.be.true
    expect(netmask('255.255.255.128')).to.be.true
    expect(netmask('255.255.255.255')).to.be.true
  })
})
