import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-detail / selectedTabLabel present', function () {
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
    expect(this.$('.frost-tabs .active div.tab').text().trim()).to.equal('Two')
  })

  describe('when selectedTab property updated to be first tab', function () {
    beforeEach(function () {
      this.set('selectedTabLabel', 'One')
      return wait()
    })

    it('renders first tab', function () {
      expect(this.$('.frost-tabs .active div.tab').text().trim()).to.equal('One')
    })
  })
})
