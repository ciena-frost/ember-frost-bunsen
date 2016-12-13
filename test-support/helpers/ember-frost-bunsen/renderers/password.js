import {expect} from 'chai'
import Ember from 'ember'
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  expectLabel
} from './common'

const assign = Object.assign || Ember.assign || Ember.merge

const SELECTORS = {
  DISABLED_INPUT: 'input:disabled',
  ENABLED_INPUT: 'input:not(:disabled)'
}

/**
* Check whether or not checkbox is disabled/enabled as expected
* @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
* @param {Boolean} disabled - whether or not checkbox should be disabled
 */
function expectDisabledInput ($renderer, disabled) {
  const selector = disabled ? SELECTORS.DISABLED_INPUT : SELECTORS.ENABLED_INPUT
  const determinerPlusVerb = disabled ? 'a disabled' : 'an enabled'

  expect(
    $renderer.find(selector),
    `renders ${determinerPlusVerb} input`
  )
    .to.have.length(1)
}

/**
 * Check that property is renderer as a password with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as password
 * @param {Object} state - expected state of password renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()
  const $input = $renderer.find('input')

  const defaults = {
    disabled: false,
    placeholder: '',
    value: ''
  }

  state = assign(defaults, state)

  expect(
    $renderer,
    'has expected class'
  )
    .to.have.class('frost-bunsen-input-password')

  expectDisabledInput($renderer, state.disabled)

  if (state.label) {
    expectLabel($renderer, state.label)
  }

  expect(
    $input.prop('placeholder'),
    'password renderer has expected placeholder text'
  )
    .to.equal(state.placeholder)

  expect(
    $input.val(),
    'password renderer input has expected value'
  )
    .to.equal(state.value)

  if (state.error) {
    expectBunsenInputToHaveError(bunsenId, state.error, hook)
  } else {
    expectBunsenInputNotToHaveError(bunsenId, hook)
  }
}

/**
 * Fill in password renderer input
 * @param {String} bunsenId - bunsen ID for property rendered as password
 * @param {String} value - value to fill input with
 * @param {String} hook - form's hook
 */
export function fillIn (bunsenId, value, hook) {
  hook = hook || 'bunsenForm'

  $hook(`${hook}-${bunsenId}`)
    .first()
    .find('input')
    .val(value)
    .trigger('input')
}
