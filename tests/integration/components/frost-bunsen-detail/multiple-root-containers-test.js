import {expect} from 'chai'
import {describe, it} from 'mocha'

import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: frost-bunsen-detail / multiple root containers', function () {
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
    }
  })

  describe('multiple root cells', function () {
    it('renders frost-tabs', function () {
      expect(this.$('.frost-tabs').length).to.equal(1)
    })

    it('renders tab for each root cell', function () {
      expect(this.$('.frost-tabs .frost-button').length).to.equal(2)
    })
  })
})
