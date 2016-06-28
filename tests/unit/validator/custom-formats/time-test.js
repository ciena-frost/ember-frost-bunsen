import {expect} from 'chai'
import {describe, it} from 'mocha'
import time from 'ember-frost-bunsen/validator/custom-formats/time'

describe('time format', () => {
  it('returns false when value is undefined', () => {
    expect(time(undefined)).to.be.false
  })

  it('returns false when value is null', () => {
    expect(time(null)).to.be.false
  })

  it('returns false when value is an object', () => {
    expect(time({})).to.be.false
  })

  it('returns false when value is an array', () => {
    expect(time([])).to.be.false
  })

  it('returns false when value is a float', () => {
    expect(time(0.5)).to.be.false
  })

  it('returns false when value is NaN', () => {
    expect(time(NaN)).to.be.false
  })

  it('returns false when value is Infinity', () => {
    expect(time(Infinity)).to.be.false
  })

  it('returns true when value is format hh:mm:ss', () => {
    expect(time('04:01:05')).to.be.true
  })

  it('returns true when value is format hh:mm', () => {
    expect(time('04:01')).to.be.true
  })

  it('returns true when value is format hh', () => {
    expect(time('04')).to.be.true
  })

  it('returns true when value is format h:mm:ss', () => {
    expect(time('4:01:05')).to.be.true
  })

  it('returns true when value is format h:mm', () => {
    expect(time('4:01')).to.be.true
  })

  it('returns true when value is format h', () => {
    expect(time('4')).to.be.true
  })

  it('returns true when value is format hh:m:ss', () => {
    expect(time('04:1:05')).to.be.true
  })

  it('returns true when value is format hh:m', () => {
    expect(time('04:1')).to.be.true
  })

  it('returns true when value is format h:m:ss', () => {
    expect(time('4:1:05')).to.be.true
  })

  it('returns true when value is format h:m', () => {
    expect(time('4:1')).to.be.true
  })

  it('returns true when value is format hh:mm:s', () => {
    expect(time('04:01:5')).to.be.true
  })

  it('returns true when value is format hh:m:s', () => {
    expect(time('04:1:5')).to.be.true
  })

  it('returns true when value is format h:mm:s', () => {
    expect(time('4:01:5')).to.be.true
  })

  it('returns true when value is format h:m:s', () => {
    expect(time('4:1:5')).to.be.true
  })

  it('returns true when value is format hh:mm:ss a', () => {
    expect(time('04:01:05 am')).to.be.true
    expect(time('04:01:05 AM')).to.be.true
    expect(time('04:01:05 a.m.')).to.be.true
    expect(time('04:01:05 A.M.')).to.be.true
    expect(time('04:01:05 pm')).to.be.true
    expect(time('04:01:05 PM')).to.be.true
    expect(time('04:01:05 p.m.')).to.be.true
    expect(time('04:01:05 P.M.')).to.be.true
  })

  it('returns true when value is format hh:mm a', () => {
    expect(time('04:01 am')).to.be.true
    expect(time('04:01 AM')).to.be.true
    expect(time('04:01 a.m.')).to.be.true
    expect(time('04:01 A.M.')).to.be.true
    expect(time('04:01 pm')).to.be.true
    expect(time('04:01 PM')).to.be.true
    expect(time('04:01 p.m.')).to.be.true
    expect(time('04:01 P.M.')).to.be.true
  })

  it('returns true when value is format hh a', () => {
    expect(time('04 am')).to.be.true
    expect(time('04 AM')).to.be.true
    expect(time('04 a.m.')).to.be.true
    expect(time('04 A.M.')).to.be.true
    expect(time('04 pm')).to.be.true
    expect(time('04 PM')).to.be.true
    expect(time('04 p.m.')).to.be.true
    expect(time('04 P.M.')).to.be.true
  })

  it('returns true when value is format h:mm:ss a', () => {
    expect(time('4:01:05 am')).to.be.true
    expect(time('4:01:05 AM')).to.be.true
    expect(time('4:01:05 a.m.')).to.be.true
    expect(time('4:01:05 A.M.')).to.be.true
    expect(time('4:01:05 pm')).to.be.true
    expect(time('4:01:05 PM')).to.be.true
    expect(time('4:01:05 p.m.')).to.be.true
    expect(time('4:01:05 P.M.')).to.be.true
  })

  it('returns true when value is format h:mm a', () => {
    expect(time('4:01 am')).to.be.true
    expect(time('4:01 AM')).to.be.true
    expect(time('4:01 a.m.')).to.be.true
    expect(time('4:01 A.M.')).to.be.true
    expect(time('4:01 pm')).to.be.true
    expect(time('4:01 PM')).to.be.true
    expect(time('4:01 p.m.')).to.be.true
    expect(time('4:01 P.M.')).to.be.true
  })

  it('returns true when value is format h a', () => {
    expect(time('4 am')).to.be.true
    expect(time('4 AM')).to.be.true
    expect(time('4 a.m.')).to.be.true
    expect(time('4 A.M.')).to.be.true
    expect(time('4 pm')).to.be.true
    expect(time('4 PM')).to.be.true
    expect(time('4 p.m.')).to.be.true
    expect(time('4 P.M.')).to.be.true
  })

  it('returns true when value is format hh:m:ss a', () => {
    expect(time('04:1:05 am')).to.be.true
    expect(time('04:1:05 AM')).to.be.true
    expect(time('04:1:05 a.m.')).to.be.true
    expect(time('04:1:05 A.M.')).to.be.true
    expect(time('04:1:05 pm')).to.be.true
    expect(time('04:1:05 PM')).to.be.true
    expect(time('04:1:05 p.m.')).to.be.true
    expect(time('04:1:05 P.M.')).to.be.true
  })

  it('returns true when value is format hh:m a', () => {
    expect(time('04:1 am')).to.be.true
    expect(time('04:1 AM')).to.be.true
    expect(time('04:1 a.m.')).to.be.true
    expect(time('04:1 A.M.')).to.be.true
    expect(time('04:1 pm')).to.be.true
    expect(time('04:1 PM')).to.be.true
    expect(time('04:1 p.m.')).to.be.true
    expect(time('04:1 P.M.')).to.be.true
  })

  it('returns true when value is format h:m:ss a', () => {
    expect(time('4:1:05 am')).to.be.true
    expect(time('4:1:05 AM')).to.be.true
    expect(time('4:1:05 a.m.')).to.be.true
    expect(time('4:1:05 A.M.')).to.be.true
    expect(time('4:1:05 pm')).to.be.true
    expect(time('4:1:05 PM')).to.be.true
    expect(time('4:1:05 p.m.')).to.be.true
    expect(time('4:1:05 P.M.')).to.be.true
  })

  it('returns true when value is format h:m a', () => {
    expect(time('4:1 am')).to.be.true
    expect(time('4:1 AM')).to.be.true
    expect(time('4:1 a.m.')).to.be.true
    expect(time('4:1 A.M.')).to.be.true
    expect(time('4:1 pm')).to.be.true
    expect(time('4:1 PM')).to.be.true
    expect(time('4:1 p.m.')).to.be.true
    expect(time('4:1 P.M.')).to.be.true
  })

  it('returns true when value is format hh:mm:s a', () => {
    expect(time('04:01:5 am')).to.be.true
    expect(time('04:01:5 AM')).to.be.true
    expect(time('04:01:5 a.m.')).to.be.true
    expect(time('04:01:5 A.M.')).to.be.true
    expect(time('04:01:5 pm')).to.be.true
    expect(time('04:01:5 PM')).to.be.true
    expect(time('04:01:5 p.m.')).to.be.true
    expect(time('04:01:5 P.M.')).to.be.true
  })

  it('returns true when value is format hh:m:s a', () => {
    expect(time('04:1:5 am')).to.be.true
    expect(time('04:1:5 AM')).to.be.true
    expect(time('04:1:5 a.m.')).to.be.true
    expect(time('04:1:5 A.M.')).to.be.true
    expect(time('04:1:5 pm')).to.be.true
    expect(time('04:1:5 PM')).to.be.true
    expect(time('04:1:5 p.m.')).to.be.true
    expect(time('04:1:5 P.M.')).to.be.true
  })

  it('returns true when value is format h:mm:s a', () => {
    expect(time('4:01:5 am')).to.be.true
    expect(time('4:01:5 AM')).to.be.true
    expect(time('4:01:5 a.m.')).to.be.true
    expect(time('4:01:5 A.M.')).to.be.true
    expect(time('4:01:5 pm')).to.be.true
    expect(time('4:01:5 PM')).to.be.true
    expect(time('4:01:5 p.m.')).to.be.true
    expect(time('4:01:5 P.M.')).to.be.true
  })

  it('returns true when value is format h:m:s a', () => {
    expect(time('4:1:5 am')).to.be.true
    expect(time('4:1:5 AM')).to.be.true
    expect(time('4:1:5 a.m.')).to.be.true
    expect(time('4:1:5 A.M.')).to.be.true
    expect(time('4:1:5 pm')).to.be.true
    expect(time('4:1:5 PM')).to.be.true
    expect(time('4:1:5 p.m.')).to.be.true
    expect(time('4:1:5 P.M.')).to.be.true
  })
})
