const expect = chai.expect
import {it} from 'ember-mocha'
import {setupComponentTest} from '../../utils/template'

const props = {
  bunsenId: 'user',
  cellConfig: Ember.Object.create({}),
  model: {},
  onChange () {},
  store: Ember.Object.create({})
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-model-container')
  })
}

setupComponentTest('frost-bunsen-model-container', props, tests)
