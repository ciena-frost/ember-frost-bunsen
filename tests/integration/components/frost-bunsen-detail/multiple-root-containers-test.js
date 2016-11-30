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
  bunsenView: {
    cellDefinitions: {
      one: {
        children: [
          {model: 'foo'},
          {model: 'bar'}
        ]
      },
      two: {
        children: [
          {model: 'baz'}
        ]
      }
    },
    cells: [
      {label: 'One', extends: 'one'},
      {label: 'Two', extends: 'two'}
    ],
    type: 'form',
    version: '2.0'
  }
}

function tests (ctx) {
  describe('multiple root cells', function () {
    it('renders frost-tabs', function () {
      expect(ctx.rootNode.find('.frost-tabs').length).to.equal(1)
    })

    it('renders tab for each root cell', function () {
      expect(ctx.rootNode.find('.frost-tabs .frost-button').length).to.equal(2)
    })
  })
}

describeComponent(...integrationTestContext('frost-bunsen-detail'),
  function () {
    let ctx = {}
    beforeEach(function () {
      this.setProperties(props)
      this.render(hbs`{{frost-bunsen-detail
        bunsenModel=bunsenModel
        bunsenView=bunsenView
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
