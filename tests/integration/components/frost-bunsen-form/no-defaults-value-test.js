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
  },
  value: {
    bar: 42,
    baz: true,
    foo: 'test'
  }
}

function tests (ctx) {
  describe('no defaults with value', function () {
    it('has correct classes', function () {
      expect(ctx.rootNode).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-number input').val()).to.eql('42')
    })

    it('renders a checkbox for baz with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-boolean input').is(':checked')).to.be.true
    })

    it('renders an input for foo with the user provided value', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-text input').val()).to.eql('test')
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
        value=value
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
