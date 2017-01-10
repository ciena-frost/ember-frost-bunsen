import {expect} from 'chai'
import _ from 'lodash'
import {describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

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

describe('Integration: frost-bunsen-form', function () {
  const ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        bar: {type: 'number'},
        baz: {type: 'boolean'},
        foo: {type: 'string'}
      },
      type: 'object'
    },
    bunsenView: _.cloneDeep(bunsenView)
  })

  describe('multiple root cells', function () {
    it('renders as expected', function () {
      const $tabs = this.$('.frost-tabs')

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
      expect(ctx.props.bunsenView).to.eql(bunsenView)
    })
  })
})
