import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

const props = {
  bunsenModel: {
    properties: {
      foo: {type: 'string'}
    },
    type: 'object'
  },
  bunsenView: {
    cellDefinitions: {
      main: {
        children: [
          {model: 'foo'}
        ]
      }
    },
    cells: [{extends: 'main'}],
    type: 'detail',
    version: '2.0'
  }
}

describe('Integration: frost-bunsen', function () {
  setupComponentTest('frost-bunsen', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    this.setProperties(props)

    this.render(hbs`{{frost-bunsen
      bunsenModel=bunsenModel
      bunsenView=bunsenView
    }}`)

    rootNode = this.$('> *')

    return wait()
  })

  describe('detail direct properties', function () {
    it('renders input', function () {
      expect(rootNode.find('.frost-bunsen-input-static').length).to.equal(1)
    })
  })
})
