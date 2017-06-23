import {expect} from 'chai'
import Ember from 'ember'
const {merge} = Ember
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  expectLabel
} from './common'

/**
 * Checks that the inputs for date and time are displaying correctly
 */
export function expectDateTimeInputs () {
  expect($hook('bunsenForm-foo-radio-button-date-picker-input').length).to.equal(1)
  expect($hook('bunsenForm-foo-radio-button-time-picker-input').length).to.equal(1)
}

/**
 * Check whether or not input box is disabled/enabled as expected
 * @param {jQuery} $renderer - jQuery instance of renderer DOM (wrapper tag)
 * @param {Boolean} disabled - whether or not input should be disabled
 */
function expectDisabledInput ($renderer, disabled) {
  const determinerPlusVerb = disabled ? 'a disabled' : 'an enabled'

  expect(
    $renderer.find('input'),
    `renders ${determinerPlusVerb} date input`
  )
    .to.have.prop('disabled', disabled)
}

/**
 * Check expected state based on which radio-button is selected
 * @param {String} hookName - bunsen ID and bunsen form parts of the hookName
 * @param {String} selectedButton - the selected radio-button
 */
function expectRadioButtonState (hookName, selectedButton) {
  const radioButtonHook = `${hookName}-radio-group-button`
  const radioButtonInputHook = `${hookName}-radio-button-date-picker-input`

  if (selectedButton === 'first') {
    expect(
      $hook(radioButtonHook).first(),
      'first radio button is checked'
    ).to.have.class('checked')

    expect(
      $hook(radioButtonHook).last(),
      'second radio button is not checked'
    ).to.not.have.class('checked')

    expect(
      $hook(radioButtonInputHook),
      'date-time-picker is disabled since first button is selected by default'
    ).to.have.prop('disabled')
  } else {
    expect(
      $hook(radioButtonHook).first(),
      'first radio button is not checked'
    ).to.not.have.class('checked')

    expect(
      $hook(radioButtonHook).last(),
      'second radio button is checked'
    ).to.have.class('checked')

    expect(
      $hook(radioButtonInputHook).prop('disabled'),
      'date-time-picker is enabled since second button is selected'
    ).to.equal(false)
  }
}

/**
 * Check that property is renderer as a boolean with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as boolean
 * @param {Object} state - expected state of boolean renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()
  const radioButtonHook = `${hookName}-radio-group-button`

  const defaults = {
    disabled: false,
    hasValue: false,
    size: 'small',
    radioButtonCount: 2,
    selectedButton: 'first'
  }

  state = merge(defaults, state)

  expect(
    $renderer,
    'has expected class'
  ).to.have.class('frost-bunsen-input-when')

  expectDisabledInput($renderer, state.disabled)

  expect(
    $hook(radioButtonHook).length,
    'has correct number of radio buttons'
  ).to.equal(state.radioButtonCount)

  expect(
    $hook(radioButtonHook),
    'radio buttons is correct size'
  ).to.have.class(state.size)

  expectRadioButtonState(hookName, state.selectedButton)

  if (state.firstButtonLabel !== undefined) {
    expect($hook(radioButtonHook).first().text().trim(),
      'first radio button label is correct'
    ).to.equal(state.firstButtonLabel)
  }

  if (state.label !== undefined) {
    expectLabel($renderer, state.label)
  }

  if (state.error) {
    expectBunsenInputToHaveError(bunsenId, state.error, hook)
  } else {
    expectBunsenInputNotToHaveError(bunsenId, hook)
  }
}

/**
 * Selects a radio button
 * @param {String} bunsenId - bunsen ID for property rendered as boolean
 * @param {Object} state - expected state of boolean renderer
 *
 */
export function selectRadioButton (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const radioButtonHook = `${hookName}-radio-group-button-input`

  const defaults = {
    buttonNumber: 1
  }

  state = merge(defaults, state)

  if (state.buttonNumber === 1) {
    $hook(radioButtonHook).first().trigger('click')
  } else {
    $hook(radioButtonHook).last().trigger('click')
  }
}
