import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

function getHook (hook, model) {
  return `${hook}-${model}`
}

describe('Integration: Component / frost-bunsen-form / renderer / autocomplete', function () {
  const hook = 'autocompleteTest'

  describe('selection', function () {
    let ctx = setupFormComponentTest({
      hook,
      bunsenModel: {
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
      },
      bunsenView: {
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
    })

    beforeEach(function () {
      return wait()
    })

    it('should render', function () {
      expect($hook(getHook(hook, 'cookies') + '-autocompleteText-input').length).to.equal(1)
    })

    describe('enter input', function () {
      const testHook = getHook(hook, 'cookies')
      beforeEach(function () {
        ctx.props.onChange.reset()
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
          expect(ctx.props.onChange.callCount, 'onChange is not called').to.equal(1)
          expect(ctx.props.onChange.args[0][0].cookies, 'onChange argument values are wrong').to.equal(dropdownValue)
        })
      })
    })
  })

  describe('error', function () {
    const schemas = {
      bunsenModel: {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string'
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
              name: 'autocomplete'
            }
          }, {
            model: 'bar'
          }]
        }]
      }
    }

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
          $hook('bunsenForm-foo').find('.frost-autocomplete input').focus()
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
})
