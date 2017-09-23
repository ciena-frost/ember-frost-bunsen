import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / input focus', function () {
  setupFormComponentTest({
    bunsenModel: {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        },
        bar: {
          type: 'string',
          conditions: [
            {
              'if': [
                {
                  './foo': {
                    'equals': 'hello'
                  }
                }
              ]
            }
          ]
        }
      }
    }
  })

  beforeEach(function () {
    return wait()
  })

  describe('when the condition is evaluated', function () {
    let $input
    beforeEach(function () {
      $input = $hook('bunsenForm-foo-input')
      $input.focus()
      this.set('value', {
        foo: 'hello'
      })
      return wait()
    })

    it('should maintain focus', function () {
      $input = $hook('bunsenForm-foo-input')
      expect($input[0]).to.equal(document.activeElement)
    })
  })
})
