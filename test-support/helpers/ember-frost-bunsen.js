// NOTE: While consumers have access to these helpers they are still considered
// private API and subject to change without notice as the tests will continue
// to be refactored until we are satisifed with the quality of the tests and
// these helpers. When we are satisfied with these helpers we will document
// them, making them public API, at which point consumers will be free to use
// them without the worry of them changing on minor/patch upgrades.

import {expect} from 'chai'
import Ember from 'ember'
import {$hook} from 'ember-hook'

const assign = Object.assign || Ember.assign || Ember.merge

export {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  fillInBunsenInput
} from './ember-frost-bunsen/renderers/common'

export {
  click as clickBunsenBooleanRenderer,
  expectWithState as expectBunsenBooleanRendererWithState
} from './ember-frost-bunsen/renderers/boolean'

export {
  expectWithState as expectBunsenButtonGroupRendererWithState
} from './ember-frost-bunsen/renderers/button-group'

export {
  expectWithState as expectBunsenCheckboxArrayRendererWithState
} from './ember-frost-bunsen/renderers/checkbox-array'

export {
  expectWithState as expectBunsenGeolocationRendererWithState
} from './ember-frost-bunsen/renderers/geolocation'

export {
  fillIn as fillInBunsenNumberRenderer,
  expectWithState as expectBunsenNumberRendererWithState
} from './ember-frost-bunsen/renderers/number'

export {
  fillIn as fillInBunsenPasswordRenderer,
  expectWithState as expectBunsenPasswordRendererWithState
} from './ember-frost-bunsen/renderers/password'

export {
  fillIn as fillInBunsenTextRenderer,
  expectWithState as expectBunsenTextRendererWithState
} from './ember-frost-bunsen/renderers/text'

export {
  fillIn as fillInBunsenTextareaRenderer,
  expectWithState as expectBunsenTextareaRendererWithState
} from './ember-frost-bunsen/renderers/textarea'

export {
  fillIn as fillInBunsenUrlRenderer,
  expectWithState as expectBunsenUrlRendererWithState
} from './ember-frost-bunsen/renderers/url'

export function expectCollapsibleHandles (count, hook) {
  hook = hook || 'bunsenForm'

  expect(
    $hook(hook).find('.frost-icon-frost-expand-collapse'),
    'renders expected number of collapsible handles'
  )
    .to.have.length(count)
}

export function expectOnChangeState (ctx, expected) {
  const spy = ctx.props.onChange
  const actual = spy.lastCall.args[0]

  expect(
    actual,
    'onChange informs consumer of expected form value'
  )
    .to.eql(expected)
}

export function expectOnValidationState (ctx, state) {
  const spy = ctx.props.onValidation
  const defaults = {
    count: 0,
    errors: [],
    warnings: []
  }

  state = assign(defaults, state)

  expect(
    spy.callCount,
    'onValidation called expected number of times'
  )
    .to.equal(state.count)

  if (state.count === 0) {
    return
  }

  const validationResult = spy.lastCall.args[0]

  expect(
    JSON.stringify(validationResult.errors),
    'onValidation informs consumer of expected errors'
  )
    .to.eql(JSON.stringify(state.errors))

  expect(
    JSON.stringify(validationResult.warnings),
    'onValidation informs consumer of expected warnings'
  )
    .to.eql(JSON.stringify(state.warnings))
}
