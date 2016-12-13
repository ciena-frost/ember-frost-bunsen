/**
 * Performance test to make sure typing into forms is snappy
 */

import Ember from 'ember'
const {Logger, RSVP} = Ember
import {after, before, describe, it} from 'mocha'
import {expect} from 'chai'
import {$hook} from 'ember-hook'
import startApp from '../helpers/start-app'
import destroyApp from '../helpers/destroy-app'
import sinon from 'sinon'

const MAX_TIMEOUT = 10000 // Travis CI can take a long time sometimes
const DEBUG_MSG = 'AbstractInput::didRender() called'

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
  let application, sandbox
  this.timeout(MAX_TIMEOUT)

  before(function () {
    sandbox = sinon.sandbox.create()
    sandbox.stub(Logger, 'debug')
    Logger.debug.withArgs(DEBUG_MSG)
    application = startApp()
    server.loadFixtures()
    server.createList('node', 5)
  })

  after(function () {
    sandbox.restore()
    destroyApp(application)
  })

  describe('typing on a simple form', function () {
    let $input, initialRenderCount
    before(function (done) {
      visit('/examples?model=simple')
      andThen(() => {
        initialRenderCount = Logger.debug.withArgs(DEBUG_MSG).callCount
        Logger.debug.reset()
        $input = $hook('bunsenForm-lastName-input')
        typeText('abcdef', $input).then(() => {
          done()
        })
      })
    })

    it('should have the full text', function () {
      andThen(() => {
        const value = getValue()
        expect(value.lastName).to.equal('abcdef')
      })
    })

    it('should re-render fewer times than initial render', function () {
      const count = Logger.debug.withArgs(DEBUG_MSG).callCount
      expect(count).to.be.below(initialRenderCount)
    })
  })

  describe('typing on a complex form', function () {
    let $input, initialRenderCount
    before(function (done) {
      visit('/examples?model=evc')
      andThen(() => {
        $input = $hook('bunsenForm-createdAt-input')
        initialRenderCount = Logger.debug.withArgs(DEBUG_MSG).callCount
        Logger.debug.reset()
        typeText('abcdef', $input).then(() => {
          done()
        })
      })
    })

    it('should have the full text', function () {
      expect($input.val()).to.equal('abcdef')
    })

    it('should re-render fewer times than initial render', function () {
      const count = Logger.debug.withArgs(DEBUG_MSG).callCount
      expect(count).to.be.below(initialRenderCount)
    })
  })
})
