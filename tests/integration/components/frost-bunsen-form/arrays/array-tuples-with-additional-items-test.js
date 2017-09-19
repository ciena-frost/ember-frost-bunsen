import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  clickBunsenBooleanRenderer,
  expectBunsenBooleanRendererWithState,
  expectBunsenNumberRendererWithState,
  expectBunsenTextRendererWithState,
  expectOnChangeState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {expectButtonWithState} from 'dummy/tests/helpers/ember-frost-core'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / array tuples with additionalProperties', function () {
  describe('without initial value', function () {
    const ctx = setupFormComponentTest({
      bunsenModel: {
        properties: {
          foo: {
            type: 'array',
            additionalItems: {
              title: 'String',
              type: 'string'
            },
            items: [{
              title: 'Bool',
              type: 'boolean'
            }, {
              title: 'Integer',
              type: 'integer'
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
      expectBunsenNumberRendererWithState('foo.1', {
        label: 'Integer'
      })

      const $button = $hook('bunsenForm-addBtn')

      expectButtonWithState($button, {
        icon: 'round-add',
        text: 'Add foo'
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

    describe('when adding items', function () {
      beforeEach(function () {
        $hook('bunsenForm-addBtn').click()
        return wait()
      })

      it('renders as expected', function () {
        expectBunsenBooleanRendererWithState('foo.0', {
          label: 'Bool',
          checked: false
        })
        expectBunsenNumberRendererWithState('foo.1', {
          label: 'Integer'
        })
        expectBunsenTextRendererWithState('foo.2', {
          label: 'String'
        })

        const $addButton = $hook('bunsenForm-addBtn')
        const $removeButton = $hook('bunsenForm-removeBtn')

        expectButtonWithState($removeButton, {
          text: 'Remove'
        })

        expectButtonWithState($addButton, {
          icon: 'round-add',
          text: 'Add foo'
        })
      })

      describe('when user removes item', function () {
        beforeEach(function () {
          $hook('bunsenForm-removeBtn').click()
          return wait()
        })

        it('renders as expected', function () {
          expectBunsenBooleanRendererWithState('foo.0', {
            label: 'Bool',
            checked: false
          })
          expectBunsenNumberRendererWithState('foo.1', {
            label: 'Integer'
          })

          const $foo2 = $hook('bunsenForm-foo.2')
          expect($foo2.length, 'should remove foo.2').to.equal(0)

          const $removeButton = $hook('bunsenForm-removeBtn')
          expect($removeButton.length, 'should not remove button').to.equal(0)
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
            additionalItems: {
              title: 'String',
              type: 'string'
            },
            items: [{
              title: 'Bool',
              type: 'boolean'
            }, {
              title: 'Integer',
              type: 'integer'
            }]
          }
        },
        type: 'object'
      },
      value: {
        foo: [true, 1, 'foo']
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
      expectBunsenNumberRendererWithState('foo.1', {
        label: 'Integer',
        value: '1'
      })
      expectBunsenTextRendererWithState('foo.2', {
        label: 'String',
        value: 'foo'
      })

      const $addButton = $hook('bunsenForm-addBtn')
      const $removeButton = $hook('bunsenForm-removeBtn')

      expectButtonWithState($removeButton, {
        text: 'Remove'
      })

      expectButtonWithState($addButton, {
        icon: 'round-add',
        text: 'Add foo'
      })
    })
  })
})
