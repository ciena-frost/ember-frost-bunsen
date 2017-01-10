import {expect} from 'chai'
import {describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: frost-bunsen-form', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        bar: {type: 'number'},
        baz: {type: 'boolean'},
        foo: {type: 'string'}
      },
      type: 'object'
    },
    value: {
      bar: 42,
      baz: true,
      foo: 'test'
    }
  })

  describe('no defaults with value', function () {
    it('has correct classes', function () {
      expect(this.$('> *')).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-number input').val()).to.eql('42')
    })

    it('renders a checkbox for baz with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-boolean input').is(':checked')).to.equal(true)
    })

    it('renders an input for foo with the user provided value', function () {
      expect(this.$('.frost-bunsen-input-text input').val()).to.eql('test')
    })
  })
})
