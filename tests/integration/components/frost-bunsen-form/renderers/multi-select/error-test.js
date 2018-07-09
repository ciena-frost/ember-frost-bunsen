import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

const schemas = {
  bunsenModel: {
    type: 'object',
    required: ['foo'],
    properties: {
      foo: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      bar: {
        type: 'string'
      }
    }
  },
  bunsenView: {
    type: 'form',
    version: '2.0',
    cells: [{
      children: [{
        model: 'foo',
        renderer: {
          name: 'multi-select'
        }
      }, {
        model: 'bar'
      }]
    }]
  }
}

describe('Integration: Component / frost-bunsen-form / renderer / multi-select error', function () {
  describe('when showAllErrors is false', function () {
    setupFormComponentTest({
      ...schemas,
      showAllErrors: false
    })

    beforeEach(function () {
      return wait()
    })

    describe('when focus is toggled', function () {
      beforeEach(function () {
        $hook('bunsenForm-foo').find('.frost-select').focus()
        $hook('bunsenForm-bar-input').focus()

        return wait()
      })

      it('should show error', function () {
        const error = $hook('bunsenForm-foo').find('.frost-bunsen-error').text().trim()
        expect(error).to.equal('Field is required.')
      })
    })
  })

  describe('when showAllErrors is true', function () {
    setupFormComponentTest({
      ...schemas,
      showAllErrors: true
    })

    beforeEach(function () {
      return wait()
    })

    it('should show error', function () {
      const error = $hook('bunsenForm-foo').find('.frost-bunsen-error').text().trim()
      expect(error).to.equal('Field is required.')
    })
  })
})
