import {expect} from 'chai'
import Ember from 'ember'

const assign = Object.assign || Ember.assign || Ember.merge

export {
  expectBunsenInputNotToHaveError,
  expectBunsenInputToHaveError,
  fillInBunsenInput
} from './ember-frost-bunsen/renderers/common'

export {
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
  expectWithState as expectBunsenHiddenRendererWithState
} from './ember-frost-bunsen/renderers/hidden'

export {
  expectWithState as expectBunsenJsonRendererWithState
} from './ember-frost-bunsen/renderers/json'

export {
  expectWithState as expectBunsenLinkRendererWithState
} from './ember-frost-bunsen/renderers/link'

export {
  expectWithState as expectBunsenMultiSelectRendererWithState
} from './ember-frost-bunsen/renderers/multi-select'

export {
  expectWithState as expectBunsenNumberRendererWithState
} from './ember-frost-bunsen/renderers/number'

export {
  expectWithState as expectBunsenPasswordRendererWithState
} from './ember-frost-bunsen/renderers/password'

export {
  expectWithState as expectBunsenPropertyChooserRendererWithState
} from './ember-frost-bunsen/renderers/property-chooser'

export {
  expectWithState as expectBunsenSelectRendererWithState
} from './ember-frost-bunsen/renderers/select'

export {
  expectWithState as expectBunsenStaticRendererWithState
} from './ember-frost-bunsen/renderers/static'

export {
  expectWithState as expectBunsenTextRendererWithState
} from './ember-frost-bunsen/renderers/text'

export {
  expectWithState as expectBunsenTextareaRendererWithState
} from './ember-frost-bunsen/renderers/textarea'

export {
  expectWithState as expectBunsenUrlRendererWithState
} from './ember-frost-bunsen/renderers/url'

export function expectOnValidationState (spy, state) {
  const defaults = {
    count: 0,
    errors: [],
    warnings: []
  }

  state = assign(defaults, state)

  expect(spy.callCount, 'called expected number of times').to.equal(state.count)

  if (state.count !== 0) {
    const validationResult = spy.lastCall.args[0]

    expect(
      JSON.stringify(validationResult.errors),
      'informs consumer of expected errors'
    )
      .to.eql(JSON.stringify(state.errors))

    expect(
      JSON.stringify(validationResult.warnings),
      'informs consumer of expected warnings'
    )
      .to.eql(JSON.stringify(state.warnings))
  }
}
