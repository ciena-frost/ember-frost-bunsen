import {expect} from 'chai'
import {it} from 'ember-mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenId: 'user',
  bunsenModel: {},
  bunsenStore: Ember.Object.create({}),
  cellConfig: Ember.Object.create({}),
  onChange () {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-model-container')
  })
}

setupComponentTest('frost-bunsen-model-container', props, tests)
