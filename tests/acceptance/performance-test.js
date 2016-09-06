/**
 * Performance test to make sure typing into forms is snappy
 */

import Ember from 'ember'
const {RSVP} = Ember
import {after, before, describe, it} from 'mocha'
import {expect} from 'chai'
import {$hook} from 'ember-hook'
import startApp from '../helpers/start-app'
import destroyApp from '../helpers/destroy-app'

// FIXME: Try to get this even lower, maybe with some debouncing of the input as the user types? (ARM 2016-09-06)
const MAX_LATENCY = 800

/**
 * Helper to simulate user typing a single character
 * @param {String} character - the character to type
 * @param {Selector} $input - the jQuery selector for the input to type into
 */
function typeCharacter (character, $input) {
  // set the value
  const previousValue = $input.val()
  $input.val(`${previousValue}${character}`)

  // trigger the change
  $input.trigger('input')
}

/**
 * Type a series of characters, one at a time
 * @param {String} text - the characters to type
 * @param {Selector} $input - the jQuery selector ofr the input to type into
 * @returns {RSVP.Promise} a promise resolved when all characters have been typed}
 */
function typeText (text, $input) {
  const promises = []
  text.split('').forEach((character) => {
    const promise = new RSVP.Promise(function (resolve) {
      setTimeout(() => {
        typeCharacter(character, $input)
        resolve()
      }, 1)
    })
    promises.push(promise)
  })

  return RSVP.Promise.all(promises)
}

/**
 * Get the value from the CodeMirror display of the value
 * @returns {Object} the JSON parsed object from the value output
 */
function getValue () {
  return JSON.parse(find('.demo-value .CodeMirror-code').text())
}

describe('Acceptance: Performance', function () {
  let application

  this.timeout(5000)

  before(function () {
    application = startApp()
    server.loadFixtures()
    server.createList('node', 5)
  })

  after(function () {
    destroyApp(application)
  })

  describe('typing on a simple form', function () {
    let $input, beforeTime
    before(function (done) {
      visit('/examples?model=simple')
      andThen(() => {
        $input = $hook('bunsenForm-lastName-input')
        beforeTime = new Date()
        typeText('abcdef', $input).then(() => {
          done()
        })
      })
    })

    it('should have the full text', function () {
      andThen(() => {
        const value = getValue()
        expect(value.lastName).to.be.equal('abcdef')
      })
    })

    it(`should be done in less than ${MAX_LATENCY}ms`, function () {
      const afterTime = new Date()
      const elapsedTime = afterTime.getTime() - beforeTime.getTime()
      expect(elapsedTime).to.be.at.most(MAX_LATENCY)
    })
  })

  describe('typing on a complex form', function () {
    let $input, beforeTime

    before(function (done) {
      visit('/examples?model=evc')
      andThen(() => {
        $input = $hook('bunsenForm-createdAt-input')
        beforeTime = new Date()
        typeText('abcdef', $input).then(() => {
          done()
        })
      })
    })

    it('should have the full text', function () {
      expect($input.val()).to.be.equal('abcdef')
    })

    it(`should be done in less than ${MAX_LATENCY}ms`, function () {
      const afterTime = new Date()
      const elapsedTime = afterTime.getTime() - beforeTime.getTime()
      expect(elapsedTime).to.be.at.most(MAX_LATENCY)
    })
  })
})
