import {expect} from 'chai'
import Ember from 'ember' // eslint-disable-line
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  expectLabel
} from './common'

const assign = Object.assign || Ember.assign || Ember.merge // eslint-disable-line

const SELECTORS = {
  DISABLED_TEXTAREA: 'textarea:disabled',
  ENABLED_TEXTAREA: 'textarea:not(:disabled)'
}

function getString (value) {
  if (value === undefined) {
    return undefined
  }

  return `${value}`
}

/**
* Check whether or not checkbox is disabled/enabled as expected
* @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
* @param {Boolean} disabled - whether or not checkbox should be disabled
 */
function expectDisabledInput ($renderer, disabled) {
  const selector = disabled ? SELECTORS.DISABLED_TEXTAREA : SELECTORS.ENABLED_TEXTAREA
  const determinerPlusVerb = disabled ? 'a disabled' : 'an enabled'

  expect(
    $renderer.find(selector),
    `renders ${determinerPlusVerb} textarea`
  )
    .to.have.length(1)
}

/**
 * Check that property is renderer as a textarea with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as textarea
 * @param {Object} state - expected state of textarea renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()
  const $textarea = $renderer.find('textarea')

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
    .to.have.class('frost-bunsen-input-textarea')

  expectDisabledInput($renderer, state.disabled)

  if (state.label) {
    expectLabel($renderer, state.label)
  }

  expect(
    $textarea.prop('placeholder'),
    'textarea renderer has expected placeholder text'
  )
    .to.equal(state.placeholder)

  expect(
    $textarea.val(),
    'textarea renderer input has expected value'
  )
    .to.equal(state.value)

  expect(
    $textarea.attr('cols'),
    'textarea renderer has expected cols'
  )
    .to.eql(getString(state.cols))

  expect(
    $textarea.attr('rows'),
    'textarea renderer has expecte rows'
  )
    .to.eql(getString(state.rows))

  if (state.error) {
    expectBunsenInputToHaveError(bunsenId, state.error, hook)
  } else {
    expectBunsenInputNotToHaveError(bunsenId, hook)
  }
}

/**
 * Fill in textarea renderer textarea
 * @param {String} bunsenId - bunsen ID for property rendered as textarea
 * @param {String} value - value to fill textarea with
 * @param {String} hook - form's hook
 */
export function fillIn (bunsenId, value, hook) {
  hook = hook || 'bunsenForm'

  $hook(`${hook}-${bunsenId}`)
    .first()
    .find('textarea')
    .val(value)
    .trigger('input')
}
