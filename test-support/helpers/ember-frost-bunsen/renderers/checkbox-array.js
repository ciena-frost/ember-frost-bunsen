import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook} from 'ember-hook'

import {
  expectBunsenInputNotToHaveError,
  expectLabel
} from './common'

const assign = Object.assign || Ember.assign || Ember.merge

const SELECTORS = {
  CHECKBOX_INPUT: 'input[type="checkbox"]',
  CHECKBOX_RENDERER: '.frost-checkbox',
  ERROR_MESSAGE: '> .frost-bunsen-error'
}

/**
 * Check that property is rendered as a checkbox-array with expected state
 * @param {String} bunsenId - bunsen ID for property rendered as checkbox-array
 * @param {Object} state - expected state of checkbox-array renderer
 */
export function expectWithState (bunsenId, state) {
  const hook = state.hook || 'bunsenForm'
  const hookName = `${hook}-${bunsenId}`
  const $renderer = $hook(hookName).first()

  const defaults = {
    disabled: false,
    items: []
  }

  state = assign(defaults, state)

  expect(
    $renderer,
    'renders a bunsen checkbox-array input'
  )
    .to.have.class('frost-bunsen-input-checkbox-array')

  const $checkboxes = $renderer.find(SELECTORS.CHECKBOX_RENDERER)

  expect(
    $checkboxes,
    'checkbox-array has expected items'
  )
    .to.have.length(state.items.length)

  $checkboxes
    .each((index, checkbox) => {
      const $checkbox = $(checkbox)

      expect(
        $checkbox.find(SELECTORS.CHECKBOX_INPUT).is(':disabled'),
        `checkbox at index ${index} is disabled`
      )
        .to.equal(state.disabled)

      expect(
        $checkbox.text().trim(),
        `checkbox at index ${index} has expected label`
      )
        .to.equal(state.items[index])
    })

  if (state.label) {
    expectLabel($renderer, state.label)
  }

  expectBunsenInputNotToHaveError(bunsenId, hook)
}
