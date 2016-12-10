import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const props = {
  bunsenModel: {
    properties: {
      bar: {type: 'number'},
      baz: {type: 'boolean'},
      foo: {type: 'string'}
    },
    type: 'object'
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
    }}`)
    rootNode = this.$('> *')
  })

  describe('no defaults with no value', function () {
    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with no value', function () {
      expect(rootNode.find('.frost-bunsen-input-number input').val()).to.eql('')
    })

    it('renders an unckecked checkbox for baz', function () {
      expect(rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.equal(false)
    })

    it('renders an input for foo with no value', function () {
      expect(rootNode.find('.frost-bunsen-input-text input').val()).to.eql('')
    })
  })
})
