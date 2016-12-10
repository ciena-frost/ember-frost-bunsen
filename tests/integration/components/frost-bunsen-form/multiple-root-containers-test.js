import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import _ from 'lodash'
import {beforeEach, describe, it} from 'mocha'

const bunsenView = {
  cellDefinitions: {
    one: {
      children: [
        {model: 'foo'},
        {model: 'bar'}
      ]
    }
  },
  cells: [
    {label: 'One', extends: 'one'},
    {model: 'baz'}
  ],
  type: 'form',
  version: '2.0'
}

const props = {
  bunsenModel: {
    properties: {
      bar: {type: 'number'},
      baz: {type: 'boolean'},
      foo: {type: 'string'}
    },
    type: 'object'
  },
  bunsenView: _.cloneDeep(bunsenView)
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

  describe('multiple root cells', function () {
    it('renders as expected', function () {
      const $tabs = rootNode.find('.frost-tabs')

      expect(
        $tabs.length,
        'renders frost-tabs'
      )
        .to.equal(1)

      const $tabButtons = $tabs.find('.frost-button')

      expect(
        $tabButtons.length,
        'renders tab for each root cell'
      )
        .to.equal(2)

      expect(
        $tabButtons.first().find('.text').text(),
        'renders correct text for first tab'
      )
        .to.equal('One')

      expect(
        $tabButtons.last().find('.text').text(),
        'renders correct text for second tab'
      )
        .to.equal('Baz')
    })

    it('does not mutate bunsenView', function () {
      expect(props.bunsenView).to.eql(bunsenView)
    })
  })
})
