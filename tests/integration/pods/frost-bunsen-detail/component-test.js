const expect = chai.expect
import {it} from 'ember-mocha'
import {setupComponentTest} from '../../../utils/template'

const props = {
  model: {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-detail')
  })
}

setupComponentTest('frost-bunsen-detail', props, tests)
