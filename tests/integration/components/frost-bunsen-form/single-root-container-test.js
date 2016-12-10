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

describe('Integration: frost-bunsen-form', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    this.setProperties(props)
    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)
    rootNode = this.$('> *')
  })

  describe('one root cell', function () {
    it('does not render frost-tabs', function () {
      expect(rootNode.find('.frost-tabs').length).to.equal(0)
    })
  })
})
