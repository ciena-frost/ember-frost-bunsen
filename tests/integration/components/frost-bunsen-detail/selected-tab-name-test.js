import {expect} from 'chai'
import {setupComponentTest, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe} from 'mocha'

describe('Integration: frost-bunsen-detail , open specific tab using tab label', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  let rootNode

  beforeEach(function () {
    let props = {
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

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-detail
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      selectedTabLabel=selectedTabLabel
    }}`)

    rootNode = this.$('> *')
  })

  it('renders tab having label `Two`', function () {
    expect(rootNode.find('.frost-tabs .active div')[0].innerText).to.equal('Two')
  })
})
