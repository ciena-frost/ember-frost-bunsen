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
      main: {
        children: [
          {model: 'foo'},
          {model: 'bar'},
          {model: 'baz'}
        ]
      }
    },
    cells: [{extends: 'main'}],
    type: 'form',
    version: '2.0'
  }
}

function tests (ctx) {
  describe('one root cell', function () {
    it('does not render frost-tabs', function () {
      expect(ctx.rootNode.find('.frost-tabs').length).to.equal(0)
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
