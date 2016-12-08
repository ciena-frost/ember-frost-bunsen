/* global fillIn */

import {expect} from 'chai'
import {$hook} from 'ember-hook'

export function expectBunsenGeolocationRendererWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $container = $hook(hookName).first()

  ;[
    'address',
    'city',
    'latitude',
    'longitude',
    'postalCode',
    'state'
  ]
    .forEach((key) => {
      const $propertyInput = $hook(`${hookName}-${key}-input`)
      expect($propertyInput, `has input for ${key}`).to.have.length(1)

      expect(
        $propertyInput.val(),
        `${key} input has expected value`
      )
        .to.equal(state[key] || '')
    })

  const countryInputHook = $hook(`${hookName}-country`)
  expect(countryInputHook, 'has input for country').to.have.length(2)

  const $buttons = $container.find('.frost-button')
  expect($buttons, 'has three buttons').to.have.length(3)

  expect(
    $buttons.eq(0).find('.frost-icon-frost-expand-collapse'),
    'first button contains correct icon'
  )
    .to.have.length(1)

  expect(
    $buttons.eq(1).find('.frost-icon-frost-expand-collapse'),
    'second button contains correct icon'
  )
    .to.have.length(1)

  expect(
    $buttons.eq(2).text().trim(),
    'third button contains correct text'
  )
    .to.equal('Use current location')

  if (state.errorMessage) {
    expect(
      $container.find('> .frost-bunsen-error').text().trim(),
      'has expected error message'
    )
      .to.equal(state.errorMessage)
  } else {
    expect(
      $container.find('> .frost-bunsen-error'),
      'does not have an error message'
    )
      .to.have.length(0)
  }
}

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

export default {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  fillInBunsenInput
}
