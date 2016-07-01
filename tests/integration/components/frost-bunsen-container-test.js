import {expect} from 'chai'
import {it} from 'ember-mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenModel: {},
  bunsenStore: Ember.Object.create({}),
  cellConfig: Ember.Object.create({}),
  errors: {},
  onChange () {},
  value: {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-container')
  })
}

setupComponentTest('frost-bunsen-container', props, tests)
