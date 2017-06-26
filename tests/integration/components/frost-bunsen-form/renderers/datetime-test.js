import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenDatetimeRendererWithState,
  expectClockpickerBunsenDatetimeRenderer,
  expectCollapsibleHandles,
  expectInputsBunsenDatetimeRenderer,
  expectOnChangeStateDatetime,
  expectOnValidationState,
  openDatepickerBunsenDatetimeRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

/**
 * Click outside the date picker to close it
 * @param {Object} context - the test context
 */
function closePikaday (context) {
  context.$().click()
}

describe('Integration: Component / frost-bunsen-form / renderer / datetime', function () {
  const ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'string'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          model: 'foo',
          renderer: {
            name: 'datetime'
          }
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
    expectOnValidationState(ctx, {count: 1})
  })

  it('should have an input for date and time', function () {
    expectInputsBunsenDatetimeRenderer()
  })

  describe('when classes are defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'datetime'
            },
            classNames: {
              label: 'custom-label',
              value: 'custom-value'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expect($hook('bunsenForm-foo').find('label.custom-label')).to.have.length(1)
      expect($hook('bunsenForm-foo').find('.custom-value input')).to.have.length(2)
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when hideLabel is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: true,
            model: 'foo',
            renderer: {
              name: 'datetime'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {label: null})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when hideLabel is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: false,
            model: 'foo',
            renderer: {
              name: 'datetime'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'datetime'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {label: 'FooBar Baz'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: true,
            model: 'foo',
            renderer: {
              name: 'datetime'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)
      expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: false,
            model: 'foo',
            renderer: {
              name: 'datetime'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when date is set', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()
      const interactor = openDatepickerBunsenDatetimeRenderer('bunsenForm-foo-datetimePicker-date-picker-input')
      interactor.selectDate(new Date(2017, 0, 24))
      closePikaday(this)
      return wait()
    })

    it('functions as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {
        hasValue: true,
        label: 'Foo'
      })
      expectOnChangeStateDatetime(ctx, {foo: '2017-01-24'})
      expectOnValidationState(ctx, {count: 1})
    })

    describe('when date is unset', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('value', {})
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDatetimeRendererWithState('foo', {
          label: 'Foo'
        })
        expectOnChangeStateDatetime(ctx, {})
        expectOnValidationState(ctx, {count: 1})
      })
    })
  })

  describe('when field is required', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()

      this.set('bunsenModel', {
        properties: {
          foo: {
            type: 'string'
          }
        },
        required: ['foo'],
        type: 'object'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {
        count: 1,
        errors: [
          {
            code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
            params: ['foo'],
            message: 'Field is required.',
            path: '#/foo',
            isRequiredError: true
          }
        ]
      })
    })

    describe('when date is set', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        const interactor = openDatepickerBunsenDatetimeRenderer('bunsenForm-foo-datetimePicker-date-picker-input')
        interactor.selectDate(new Date(2017, 0, 24))
        closePikaday(this)
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDatetimeRendererWithState('foo', {
          hasValue: true,
          label: 'Foo'
        })
        expectOnChangeStateDatetime(ctx, {foo: '2017-01-24'})
        expectOnValidationState(ctx, {count: 1})
      })

      describe('when date is unset', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          this.set('value', {})
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
          expectOnChangeStateDatetime(ctx, {})
          expectOnValidationState(ctx, {
            count: 1,
            errors: [
              {
                code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                params: ['foo'],
                message: 'Field is required.',
                path: '#/foo',
                isRequiredError: true
              }
            ]
          })
        })
      })
    })

    describe('when showAllErrors is false', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', false)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
        expectOnValidationState(ctx, {count: 0})
      })

      describe('when user sets date', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          const interactor = openDatepickerBunsenDatetimeRenderer('bunsenForm-foo-datetimePicker-date-picker-input')
          interactor.selectDate(new Date(2017, 0, 24))
          closePikaday(this)
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDatetimeRendererWithState('foo', {
            hasValue: true,
            label: 'Foo'
          })
          expectOnChangeStateDatetime(ctx, {foo: '2017-01-24'})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when date is unset', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()
            this.set('value', {})
            return wait()
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenDatetimeRendererWithState('foo', {})
            expectOnChangeStateDatetime(ctx, {})
            expectOnValidationState(ctx, {
              count: 1,
              errors: [
                {
                  code: 'OBJECT_MISSING_REQUIRED_PROPERTY',
                  params: ['foo'],
                  message: 'Field is required.',
                  path: '#/foo',
                  isRequiredError: true
                }
              ]
            })
          })
        })
      })
    })

    describe('when showAllErrors is true', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', true)
        return wait()
      })

      describe('when user selects date', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          const interactor = openDatepickerBunsenDatetimeRenderer('bunsenForm-foo-datetimePicker-date-picker-input')
          interactor.selectDate(new Date(2017, 0, 24))
          closePikaday(this)
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenDatetimeRendererWithState('foo', {
            hasValue: true,
            label: 'Foo'
          })
          expectOnChangeStateDatetime(ctx, {foo: '2017-01-24'})
          expectOnValidationState(ctx, {count: 1})
        })
      })
    })
  })

  describe('when time is set', function () {
    it('functions as expected', function () {
      expectClockpickerBunsenDatetimeRenderer('bunsenForm-foo-datetimePicker-time-picker-input')
      expectBunsenDatetimeRendererWithState('foo', {label: 'Foo'})
    })
  })
})
