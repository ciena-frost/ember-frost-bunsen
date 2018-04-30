import {expect} from 'chai'
import {$hook} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

function getHook (hook, model) {
  return `${hook}-${model}`
}

describe('Integration: Component / frost-bunsen-form / renderer / autocomplete', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  const bunsenModel = {
    properties: {
      cookies: {
        enum: [
          'Chocolate',
          'Peanut Butter',
          'Oatmeal',
          'Oreo'
        ],
        type: 'string'
      }
    },
    type: 'object'
  }

  const bunsenView = {
    cells: [
      {
        children: [
          {
            label: 'Cookie',
            model: 'cookies',
            renderer: {
              name: 'autocomplete'
            },
            placeholder: 'Type o'
          }
        ]
      }
    ],
    type: 'form',
    version: '2.0'
  }

  let sandbox, onChange
  const hook = 'autocompleteTest'

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    onChange = sandbox.spy()

    this.setProperties({
      bunsenModel,
      bunsenView,
      onChange,
      hook
    })

    this.render(hbs`
      {{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        hook=hook
        onChange=onChange
      }}
    `)
    return wait()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should render', function () {
    expect($hook(getHook(hook, 'cookies') + '-autocompleteText-input').length).to.equal(1)
  })

  describe('enter input', function () {
    const testHook = getHook(hook, 'cookies')
    beforeEach(function () {
      onChange.reset()
      $hook(`${testHook}-autocompleteText-input`).val('O').trigger('input').trigger('keypress')
      return wait()
    })

    describe('select an item', function () {
      let dropdownValue

      beforeEach(function () {
        const element = $hook(`${testHook}-autocompleteDropdown-item`, {index: 1})
        dropdownValue = element.text().trim()
        element.trigger('mousedown')
        return wait()
      })

      it('should have correct value chosen for input', function () {
        expect($hook(`${testHook}-autocompleteText-input`)[0].value).to.equal(dropdownValue)
      })
      it('should have received onChange', function () {
        expect(onChange.callCount, 'onChange is not called').to.equal(1)
        expect(onChange.args[0][0].cookies, 'onChange argument values are wrong').to.equal(dropdownValue)
      })
    })
  })
})
