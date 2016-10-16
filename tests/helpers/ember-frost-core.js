import {expect} from 'chai'
import Ember from 'ember'
const {typeOf} = Ember
import {$hook} from 'ember-hook'

const assign = Object.assign || Ember.assign || Ember.merge

/**
 * @typedef {Object} FrostButtonState
 * @property {Boolean} [disabled=false] - whether or not button is disabled
 * @property {String} [icon] - name of button icon
 * @property {String} [pack="frost"] - name of icon pack for button's icon
 * @property {String} [text] - button text
 */

/**
 * Verify button exists with expected state
 * @param {jQuery|String} button - name of Ember hook or jQuery istance
 * @param {FrostButtonState} state - expected button state
 */
export function expectButtonWithState (button, state) {
  const defaults = {
    disabled: false,
    pack: 'frost'
  }

  const $button = typeOf(button) === 'string' ? $hook(button) : button
  state = assign(defaults, state)

  expect(
    $button.is(':disabled'),
    `button is ${state.disabled ? 'disabled' : 'enabled'}`
  )
    .to.equal(state.disabled)

  if (state.icon && state.pack) {
    expect(
      $button.find(`.frost-icon-${state.pack}-${state.icon}`),
      'has expected icon'
    )
      .to.have.length(1)
  }

  if (state.text) {
    expect(
      $button.find('.text:not(.icon-text)').text().trim(),
      'has expected text'
    )
      .to.equal(state.text)
  }
}

export default {
  expectButtonWithState
}
