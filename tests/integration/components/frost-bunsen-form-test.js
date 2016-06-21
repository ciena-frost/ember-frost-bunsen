import {expect} from 'chai'
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import validModel from '../../fixtures/valid-model'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenModel: {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-form')
  })

  describe('when bunsenModel is invalid', function () {
    beforeEach(function () {
      this.set('bunsenModel', {
        badKey: 'I break things'
      })
    })

    it('renders frost-bunsen-validation-result', function () {
      expect(ctx.rootNode.find('.frost-bunsen-validation-result')).to.have.length(1)
    })

    it('does not render form', function () {
      expect(ctx.rootNode.find('form')).to.have.length(0)
    })
  })

  describe('when bunsenModel is valid', function () {
    beforeEach(function () {
      this.set('bunsenModel', validModel)
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
