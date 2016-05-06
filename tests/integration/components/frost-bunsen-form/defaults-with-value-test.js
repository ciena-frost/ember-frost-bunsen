import {expect} from 'chai'
import {it} from 'ember-mocha'
import {describe} from 'mocha'
import {setupComponentTest} from '../../../utils/template'

const props = {
  model: {
    properties: {
      bar: {
        default: 100,
        type: 'number'
      },
      baz: {
        default: true,
        type: 'boolean'
      },
      foo: {
        default: 'bar',
        type: 'string'
      }
    },
    type: 'object'
  },
  value: {
    bar: 42,
    baz: false,
    foo: 'test'
  }
}

function tests (ctx) {
  describe('defaults with value', function () {
    it('has correct classes', function () {
      expect(ctx.rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-number input').val()).to.eql('42')
    })

    it('renders a checkbox for baz with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.false
    })

    it('renders an input for foo with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-text input').val()).to.eql('test')
    })
  })
}

setupComponentTest('frost-bunsen-form', props, tests)
