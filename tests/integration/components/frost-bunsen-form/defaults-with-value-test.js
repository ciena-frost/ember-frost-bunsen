import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const props = {
  bunsenModel: {
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

describe('Integration: frost-bunsen-form', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    this.setProperties(props)
    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      value=value
    }}`)
    rootNode = this.$('> *')
  })

  describe('defaults with value', function () {
    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the user provided value', function () {
      expect(rootNode.find('.frost-bunsen-input-number input').val()).to.eql('42')
    })

    it('renders a checkbox for baz with the user provided value', function () {
      expect(rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.equal(false)
    })

    it('renders an input for foo with the user provided value', function () {
      expect(rootNode.find('.frost-bunsen-input-text input').val()).to.eql('test')
    })
  })
})
