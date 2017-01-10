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
    },
    value: {
      bar: 42,
      baz: false,
      foo: 'test'
    }
  })

  describe('defaults with value', function () {
    it('has correct classes', function () {
      expect(this.$('> *')).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-number input').val()).to.eql('42')
    })

    it('renders a checkbox for baz with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-boolean input').is(':checked')).to.equal(false)
    })

    it('renders an input for foo with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-text input').val()).to.eql('test')
    })
  })
})
