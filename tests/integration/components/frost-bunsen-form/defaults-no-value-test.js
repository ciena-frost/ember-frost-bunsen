import { find } from '@ember/test-helpers';
import {expect} from 'chai'
import {describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: frost-bunsen-form', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        bar: {
          default: 100,
          type: 'number'
        },
        baz: {
          default: true,
          type: 'boolean'
        },
        foo: {
          default: 'bar',
          type: 'string'
        }
      },
      type: 'object'
    }
  })

  describe('defaults with no value', function () {
    it('has correct classes', function () {
      expect(this.$('> *')).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the default value', function () {
      expect(find('.frost-bunsen-input-number input').value).to.eql('100')
    })

    it('renders a checkbox for baz with the default value', function () {
      expect(this.$('.frost-bunsen-input-boolean input').is(':checked')).to.equal(true)
    })

    it('renders an input for foo with the default value', function () {
      expect(find('.frost-bunsen-input-text input').value).to.eql('bar')
    })
  })
})
