import {expect} from 'chai'
import {describe, it} from 'mocha'
import date from 'ember-frost-bunsen/validator/custom-formats/date'

describe('date format', () => {
  it('returns false when value is undefined', () => {
    expect(date(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(date(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(date({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(date([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(date(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(date(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(date(Infinity)).to.be.false
  })

  it('returns true when value is in format MMMM DD YYYY', () => {
    expect(date('August 03 2015')).to.be.true
  })

  it('returns true when value is in format MMMM D YYYY', () => {
    expect(date('August 3 2015')).to.be.true
  })

  /* FIXME: this test passes in Chrome but fails in Firefox
  it('returns true when value is in format MMMM DD YY', () => {
    expect(date('August 03 15')).to.be.true
  })
  */

  /* FIXME: this test passes in Chrome but fails in Firefox
  it('returns true when value is in format MMMM D YY', () => {
    expect(date('August 3 15')).to.be.true
  })
  */

  it('returns true when value is in format MMM DD YYYY', () => {
    expect(date('Aug 03 2015')).to.be.true
  })

  it('returns true when value is in format MMM D YYYY', () => {
    expect(date('Aug 3 2015')).to.be.true
  })

  /* FIXME: this test passes in Chrome but fails in Firefox
  it('returns true when value is in format MMM DD YY', () => {
    expect(date('Aug 03 15')).to.be.true
  })
  */

  /* FIXME: this test passes in Chrome but fails in Firefox
  it('returns true when value is in format MMM D YY', () => {
    expect(date('Aug 3 15')).to.be.true
  })
  */

  it('returns true when value is in format MM DD YYYY', () => {
    expect(date('08 03 2015')).to.be.true
  })

  it('returns true when value is in format MM D YYYY', () => {
    expect(date('08 3 2015')).to.be.true
  })

  it('returns true when value is in format MM DD YY', () => {
    expect(date('08 03 15')).to.be.true
  })

  it('returns true when value is in format MM D YY', () => {
    expect(date('08 3 15')).to.be.true
  })

  it('returns true when value is in format M DD YYYY', () => {
    expect(date('8 03 2015')).to.be.true
  })

  it('returns true when value is in format M D YYYY', () => {
    expect(date('8 3 2015')).to.be.true
  })

  it('returns true when value is in format M DD YY', () => {
    expect(date('8 03 15')).to.be.true
  })

  it('returns true when value is in format M D YY', () => {
    expect(date('8 3 15')).to.be.true
  })

  it('returns true when value is in format MM/DD/YYYY', () => {
    expect(date('08/03/2015')).to.be.true
  })

  it('returns true when value is in format MM/D/YYYY', () => {
    expect(date('08/3/2015')).to.be.true
  })

  it('returns true when value is in format MM/DD/YY', () => {
    expect(date('08/03/15')).to.be.true
  })

  it('returns true when value is in format MM/D/YY', () => {
    expect(date('08/3/15')).to.be.true
  })

  it('returns true when value is in format M/DD/YYYY', () => {
    expect(date('8/03/2015')).to.be.true
  })

  it('returns true when value is in format M/D/YYYY', () => {
    expect(date('8/3/2015')).to.be.true
  })

  it('returns true when value is in format M/DD/YY', () => {
    expect(date('8/03/15')).to.be.true
  })

  it('returns true when value is in format M/D/YY', () => {
    expect(date('8/3/15')).to.be.true
  })
})
