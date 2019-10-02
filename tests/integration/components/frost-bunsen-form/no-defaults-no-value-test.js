import { find } from '@ember/test-helpers';
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
    }
  })

  describe('no defaults with no value', function () {
    it('has correct classes', function () {
      expect(this.$('> *')).to.have.class('frost-bunsen-form')
    })

    it('renders an input for bar with no value', function () {
      expect(find('.frost-bunsen-input-number input').value).to.eql('')
    })

    it('renders an unckecked checkbox for baz', function () {
      expect(this.$('.frost-bunsen-input-boolean input').is(':checked')).to.equal(false)
    })

    it('renders an input for foo with no value', function () {
      expect(find('.frost-bunsen-input-text input').value).to.eql('')
    })
  })
})
