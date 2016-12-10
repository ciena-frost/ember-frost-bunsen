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

describe('Integration: frost-bunsen-detail', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    this.setProperties(props)
    this.render(hbs`{{frost-bunsen-detail
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)
    rootNode = this.$('> *')
  })

  describe('multiple root cells', function () {
    it('renders frost-tabs', function () {
      expect(rootNode.find('.frost-tabs').length).to.equal(1)
    })

    it('renders tab for each root cell', function () {
      expect(rootNode.find('.frost-tabs .frost-button').length).to.equal(2)
    })
  })
})
