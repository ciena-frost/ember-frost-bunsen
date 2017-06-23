import {expect} from 'chai'
import {$hook} from 'ember-hook'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenWhenRendererWithState,
  expectClockpickerBunsenDatetimeRenderer,
  expectCollapsibleHandles,
  expectInputsBunsenWhenRenderer,
  expectOnChangeStateDatetime,
  expectOnValidationState,
  openDatepickerBunsenDatetimeRenderer,
  selectRadioButtonBunsenWhenRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

/**
 * Click outside the date picker to close it
 * @param {Object} context - the test context
 */
function closePikaday (context) {
  context.$().click()
}

describe('Integration: Component / frost-bunsen-form / renderer / when', function () {
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
          children: [
            {
              model: 'foo',
              renderer: {
                name: 'when',
                value: 'RIGHT_NOW'
              }
            }
          ]
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
    expectOnValidationState(ctx, {count: 2})
  })

  it('should have an input for date and time', function () {
    expectInputsBunsenWhenRenderer()
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: 'FooBar Baz'})
      expectOnValidationState(ctx, {count: 2})
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
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 2})
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
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 2})
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
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: null})
      expectOnValidationState(ctx, {count: 2})
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
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when render.label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              label: 'BarBaz',
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {
        label: 'Foo',
        firstButtonLabel: 'BarBaz'
      })
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when user clicks second radio button', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('enables the date-time-picker', function () {
      expectCollapsibleHandles(0)
      selectRadioButtonBunsenWhenRenderer('foo', {buttonNumber: 2})
      expectBunsenWhenRendererWithState('foo', {
        label: 'Foo',
        selectedButton: 'second'
      })
      expectOnValidationState(ctx, {count: 3})
    })

    describe('when date is set', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        selectRadioButtonBunsenWhenRenderer('foo', {buttonNumber: 2})
        const interactor = openDatepickerBunsenDatetimeRenderer('bunsenForm-foo-radio-button-date-picker-input')
        interactor.selectDate(new Date(2017, 0, 24))
        closePikaday(this)
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectOnChangeStateDatetime(ctx, {foo: '2017-01-24'})
        expectOnValidationState(ctx, {count: 3})
      })
    })

    describe('when time is set', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        selectRadioButtonBunsenWhenRenderer('foo', {buttonNumber: 2})
      })

      it('functions as expected', function () {
        expectClockpickerBunsenDatetimeRenderer('bunsenForm-foo-radio-button-time-picker-input')
      })
    })
  })

  describe('when user leaves second radio button and clicks first', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('disables the date-time-picker', function () {
      expectCollapsibleHandles(0)
      selectRadioButtonBunsenWhenRenderer('foo', {buttonNumber: 2})
      expectBunsenWhenRendererWithState('foo', {
        label: 'Foo',
        selectedButton: 'second'
      })
      selectRadioButtonBunsenWhenRenderer('foo', {buttonNumber: 1})
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 4})
    })
  })

  describe('when property renderer.label in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              label: 'Test',
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {
        label: 'Foo',
        firstButtonLabel: 'Test'
      })
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when property renderer.size in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'when',
              size: 'medium',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {
        label: 'Foo',
        size: 'medium'
      })
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when property renderer.dateFormat in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              dateFormat: 'YYYY MM DD',
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders using provided dateFormat', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      const dateValue = $hook('bunsenForm-foo-radio-button-date-picker-input').val()
      const dateTest = /^\d{4}\s\d\d\s\d\d$/.test(dateValue)
      expect(dateTest).to.equal(true)
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when property renderer.timeFormat in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'when',
              timeFormat: 'HH:mm',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders using provided timeFormat', function () {
      expectCollapsibleHandles(0)
      expectBunsenWhenRendererWithState('foo', {label: 'Foo'})
      const timeFormat = $hook('bunsenForm-foo-radio-button-time-picker-input').val()
      const timeTest = /^\d\d:\d\d$/.test(timeFormat)
      expect(timeTest).to.equal(true)
      expectOnValidationState(ctx, {count: 2})
    })
  })

  describe('when REQUIRED property renderer.value in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'when',
              value: 'RIGHT_NOW'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders using provided value', function () {
      expect(
        $hook('bunsenForm-foo-radio-group-button-input', {value: 'RIGHT_NOW'}).val()
      ).to.equal('RIGHT_NOW')
    })
  })
})
