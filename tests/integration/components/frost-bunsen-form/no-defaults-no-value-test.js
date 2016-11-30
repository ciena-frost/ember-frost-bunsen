import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe} from 'mocha'
import {integrationTestContext} from 'dummy/tests/helpers/template'

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

function tests (ctx) {
  describe('no defaults with no value', function () {
    it('has correct classes', function () {
      expect(ctx.rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with no value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-number input').val()).to.eql('')
    })

    it('renders an unckecked checkbox for baz', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.equal(false)
    })

    it('renders an input for foo with no value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-text input').val()).to.eql('')
    })
  })
}

describeComponent(...integrationTestContext('frost-bunsen-form'),
  function () {
    let ctx = {}

    beforeEach(function () {
      this.setProperties(props)
      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
