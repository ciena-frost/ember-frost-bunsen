import {expect} from 'chai'
import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: frost-bunsen-detail , when selectedTabLabel is exit', function () {
  setupDetailComponentTest({
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
  })

  it('renders second tab', function () {
    expect(this.$('.frost-tabs .active div').text().trim()).to.equal('Two')
  })

  describe('when selectedTab property updated to be first tab', function () {
    beforeEach(function () {
      this.set('selectedTabLabel', 'One')
    })

    it('renders first tab', function () {
      expect(this.$('.frost-tabs .active div').text().trim()).to.equal('One')
    })
  })
})
