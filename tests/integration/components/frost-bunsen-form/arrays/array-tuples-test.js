import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  clickBunsenBooleanRenderer,
  expectBunsenBooleanRendererWithState,
  expectBunsenTextRendererWithState,
  expectOnChangeState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / array with tuples', function () {
  describe('without initial value', function () {
    const ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            type: 'array',
            items: [{
              title: 'Bool',
              type: 'boolean'
            }, {
              title: 'String',
              type: 'string'
            }]
          }
        },
        type: 'object'
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render as expected', function () {
      expectBunsenBooleanRendererWithState('foo.0', {
        label: 'Bool',
        checked: false
      })
      expectBunsenTextRendererWithState('foo.1', {
        label: 'String',
        value: ''
      })
    })

    it('should take user input', function () {
      clickBunsenBooleanRenderer('foo.0')
      return wait().then(() => {
        expectOnChangeState(ctx, {
          foo: [true]
        })
      })
    })
  })

  describe('with initial value', function () {
    setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            type: 'array',
            items: [{
              title: 'Bool',
              type: 'boolean'
            }, {
              title: 'String',
              type: 'string'
            }]
          }
        },
        type: 'object'
      },
      value: {
        foo: [true, 'blahblah']
      }
    })

    beforeEach(function () {
      return wait()
    })

    it('should render as expected', function () {
      expectBunsenBooleanRendererWithState('foo.0', {
        label: 'Bool',
        checked: true
      })
      expectBunsenTextRendererWithState('foo.1', {
        label: 'String',
        value: 'blahblah'
      })
    })
  })
})
