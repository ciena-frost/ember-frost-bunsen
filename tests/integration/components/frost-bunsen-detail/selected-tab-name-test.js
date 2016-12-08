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
  },
  selectedTabLabel: 'Two'
}

function tests (ctx) {
  describe('open specific tab using tab label', function () {
    it('renders tab having label `Two`', function () {
      expect(ctx.rootNode.find('.frost-tabs .active div')[0].innerText).to.equal('Two')
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
        selectedTabLabel=selectedTabLabel
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
