const expect = chai.expect
import {it} from 'ember-mocha'
import {setupComponentTest} from '../../../utils/template'

const props = {
  bunsenId: 'user',
  cellConfig: Ember.Object.create({}),
  model: {},
  'on-change': () => {},
  store: Ember.Object.create({})
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-container-model')
  })
}

setupComponentTest('frost-bunsen-container-model', props, tests)
