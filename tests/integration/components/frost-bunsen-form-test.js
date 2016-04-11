const expect = chai.expect
const {run} = Ember
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import validModel from '../../fixtures/valid-model'
import {setupComponentTest} from '../../utils/template'

const props = {
  model: {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-form')
  })

  describe('when model is invalid', function () {
    beforeEach(function () {
      run(() => {
        this.set('model', {
          badKey: 'I break things'
        })
      })
    })

    it('renders frost-bunsen-validation-result', function () {
      expect(ctx.rootNode.find('.frost-bunsen-validation-result')).to.have.length(1)
    })

    it('does not render form', function () {
      expect(ctx.rootNode.find('form')).to.have.length(0)
    })
  })

  describe('when model is valid', function () {
    beforeEach(function () {
      run(() => {
        this.set('model', validModel)
      })
    })

    it('does not render frost-bunsen-validation-result', function () {
      expect(ctx.rootNode.find('.frost-bunsen-validation-result')).to.have.length(0)
    })

    it('renders a form', function () {
      expect(ctx.rootNode.find('form')).to.have.length(1)
    })
  })
}

setupComponentTest('frost-bunsen-form', props, tests)
