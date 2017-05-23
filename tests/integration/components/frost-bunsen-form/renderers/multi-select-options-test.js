import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectBunsenInputToHaveError,
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / multi-select options', function () {
  let ctx, onClickStub, sandbox
  ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          items: {
            enum: ['bar', 'baz'],
            type: 'string'
          },
          type: 'array'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          model: 'foo',
          renderer: {
            name: 'multi-select',
            options: {
              onClick: function () {
                onClickStub()
              }
            }
          }
        }
      ],
      type: 'form',
      version: '2.0'
    },
    hook: 'my-form'
  })

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    onClickStub = sandbox.stub()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when clicked', function () {
    beforeEach(function () {
      $hook('my-form-foo').find('.frost-select').click()
      return wait()
    })

    it('should call onClick passed in via renderer options', function () {
      expect(onClickStub).to.have.callCount(1)
    })
  })
})
