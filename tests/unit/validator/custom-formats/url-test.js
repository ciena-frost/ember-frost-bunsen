import {expect} from 'chai'
import {describe, it} from 'mocha'
import url from 'ember-frost-bunsen/validator/custom-formats/url'

describe('hex-string format', () => {
  it('returns false when value is undefined', () => {
    expect(url(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(url(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(url({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(url([])).to.be.false
  })

  it('returns false when value is an integer', () => {
    expect(url(1)).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(url(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(url(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(url(Infinity)).to.be.false
  })

  it('returns false when value is not valid', () => {
    [
      'a',
      '1'
    ]
      .forEach((value) => {
        console.info(value)
        expect(url(value)).to.be.false
      })
  })

  it('returns true when value is valid', () => {
    [
      'https://domain.com',
      'https://subdomain.domain.com',
      'https://www.domain.com',
      'https://www.subdomain.domain.com'
    ]
      .forEach((value) => {
        console.info(value)
        expect(url(value)).to.be.true
      })
  })
})
