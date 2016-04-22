import {expect} from 'chai'
import {it} from 'ember-mocha'
import {describe} from 'mocha'
import {setupComponentTest} from '../../../utils/template'

const props = {
  model: {
    properties: {
      bar: {type: 'number'},
      baz: {type: 'boolean'},
      foo: {type: 'string'}
    },
    type: 'object'
  }
}

function tests (ctx) {
  describe('no defaults with no value', function () {
    it('has correct classes', function () {
      expect(ctx.rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with no value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-number input').val()).to.eql('')
    })

    it('renders an unckecked checkbox for baz', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.fasly
    })

    it('renders an input for foo with no value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-text input').val()).to.eql('')
    })
  })
}

setupComponentTest('frost-bunsen-form', props, tests)
