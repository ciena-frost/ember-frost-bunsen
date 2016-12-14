import {expect} from 'chai'
import {$hook} from 'ember-hook'

export function expectWithState (bunsenId, state) {
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
