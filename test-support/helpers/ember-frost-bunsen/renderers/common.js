/* global fillIn */

import {expect} from 'chai'
import {$hook} from 'ember-hook'

/**
 * Verify bunsen input is not in error state
 * @param {String} bunsenId - identifier of bunsen property to verify
 * @param {String} [hook='bunsenForm'] - hook passed into bunsen form instance
 */
export function expectBunsenInputNotToHaveError (bunsenId, hook = 'bunsenForm') {
  const hookName = `${hook}-${bunsenId}`
  const $container = $hook(hookName).first()

  expect(
    $container.find('.frost-bunsen-left-input .error'),
    'input does not have error class'
  )
    .to.have.length(0)

  expect(
    $container.find('.frost-bunsen-left-input + .error'),
    'error message container is not present'
  )
    .to.have.length(0)
}

/**
 * Verify bunsen input is in error state
 * @param {String} bunsenId - identifier of bunsen property to verify
 * @param {String} errorMessage - error message that should be present for input
 * @param {String} [hook='bunsenForm'] - hook passed into bunsen form instance
 */
export function expectBunsenInputToHaveError (bunsenId, errorMessage, hook = 'bunsenForm') {
  const hookName = `${hook}-${bunsenId}`
  const $container = $hook(hookName).first()
  const $errorMessage = $container.find('.frost-bunsen-left-input + .frost-bunsen-error')
  expect(
    $container.find('.frost-bunsen-left-input .error'),
    'input has error class'
  )
    .not.to.have.length(0)

  expect(
    $errorMessage,
    'error message container is present'
  )
    .to.have.length(1)

  expect(
    $errorMessage.text().trim(),
    'error message is as expected'
  )
    .to.equal(errorMessage)
}

/**
 * Fill in bunsen input with value
 * @param {String} bunsenId - identifier of bunsen property to fill in
 * @param {Any} value - value to set input to
 * @param {String} [hook='bunsenForm'] - hook passed into bunsen form instance
 * @returns {RSVP.Promise} promise that resolves when all async behavior completes
 */
export function fillInBunsenInput (bunsenId, value, hook = 'bunsenForm') {
  const hookName = `${hook}-${bunsenId}-input`
  return fillIn($hook(hookName), value)
}
