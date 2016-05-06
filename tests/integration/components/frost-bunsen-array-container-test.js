import {expect} from 'chai'
import {it} from 'ember-mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenId: 'user',
  cellConfig: Ember.Object.create({}),
  model: {},
  onChange () {},
  store: Ember.Object.create({})
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-array-container')
  })
}

setupComponentTest('frost-bunsen-array-container', props, tests)
