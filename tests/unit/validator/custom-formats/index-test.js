import {expect} from 'chai'
import {describe, it} from 'mocha'
import customFormats from 'ember-frost-bunsen/validator/custom-formats'
import bgpAs from 'ember-frost-bunsen/validator/custom-formats/bgp-as'
import date from 'ember-frost-bunsen/validator/custom-formats/date'
import hexString from 'ember-frost-bunsen/validator/custom-formats/hex-string'
import int8 from 'ember-frost-bunsen/validator/custom-formats/int8'
import int16 from 'ember-frost-bunsen/validator/custom-formats/int16'
import int32 from 'ember-frost-bunsen/validator/custom-formats/int32'
import int64 from 'ember-frost-bunsen/validator/custom-formats/int64'
import ipv4Address from 'ember-frost-bunsen/validator/custom-formats/ipv4-address'
import ipv4Interface from 'ember-frost-bunsen/validator/custom-formats/ipv4-interface'
import ipv4Prefix from 'ember-frost-bunsen/validator/custom-formats/ipv4-prefix'
import netmask from 'ember-frost-bunsen/validator/custom-formats/netmask'
import portNumber from 'ember-frost-bunsen/validator/custom-formats/port-number'
import time from 'ember-frost-bunsen/validator/custom-formats/time'
import uint8 from 'ember-frost-bunsen/validator/custom-formats/uint8'
import uint16 from 'ember-frost-bunsen/validator/custom-formats/uint16'
import uint32 from 'ember-frost-bunsen/validator/custom-formats/uint32'
import url from 'ember-frost-bunsen/validator/custom-formats/url'
import vlanId from 'ember-frost-bunsen/validator/custom-formats/vlan-id'

describe('custom formats', () => {
  it('includes bgp-as format', () => {
    expect(customFormats['bgp-as']).to.equal(bgpAs)
  })

  it('includes date format', () => {
    expect(customFormats.date).to.equal(date)
  })

  it('includes hex-string format', () => {
    expect(customFormats['hex-string']).to.equal(hexString)
  })

  it('includes int8 format', () => {
    expect(customFormats.int8).to.equal(int8)
  })

  it('includes int16 format', () => {
    expect(customFormats.int16).to.equal(int16)
  })

  it('includes int32 format', () => {
    expect(customFormats.int32).to.equal(int32)
  })

  it('includes int64 format', () => {
    expect(customFormats.int64).to.equal(int64)
  })

  it('includes ipv4-address format', () => {
    expect(customFormats['ipv4-address']).to.equal(ipv4Address)
  })

  it('includes ipv4-interface format', () => {
    expect(customFormats['ipv4-interface']).to.equal(ipv4Interface)
  })

  it('includes ipv4-prefix format', () => {
    expect(customFormats['ipv4-prefix']).to.equal(ipv4Prefix)
  })

  it('includes netmask format', () => {
    expect(customFormats.netmask).to.equal(netmask)
  })

  it('includes port-number format', () => {
    expect(customFormats['port-number']).to.equal(portNumber)
  })

  it('includes time format', () => {
    expect(customFormats.time).to.equal(time)
  })

  it('includes uint8 format', () => {
    expect(customFormats.uint8).to.equal(uint8)
  })

  it('includes uint16 format', () => {
    expect(customFormats.uint16).to.equal(uint16)
  })

  it('includes uint32 format', () => {
    expect(customFormats.uint32).to.equal(uint32)
  })

  it('includes url format', () => {
    expect(customFormats.url).to.equal(url)
  })

  it('includes vlan-id format', () => {
    expect(customFormats['vlan-id']).to.equal(vlanId)
  })
})
