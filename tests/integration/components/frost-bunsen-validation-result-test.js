import {expect} from 'chai'
import {it} from 'ember-mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  model: {
    errors: [],
    warnings: []
  }
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-validation-result')
  })
}

setupComponentTest('frost-bunsen-validation-result', props, tests)
