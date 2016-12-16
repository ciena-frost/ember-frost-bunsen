import {
  expectBunsenCheckboxArrayRendererWithState,
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-form / renderer / checkbox-array', function () {
  const ctx = setupFormComponentTest({
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
            name: 'checkbox-array'
          }
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenCheckboxArrayRendererWithState('foo', {
      items: ['bar', 'baz'],
      label: 'Foo'
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
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'FooBar Baz'
      })
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
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'Foo'
      })
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
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when form disabled', function () {
    beforeEach(function () {
      this.set('disabled', true)
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        disabled: true,
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when property explicitly enabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: false,
            model: 'foo',
            renderer: {
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when property disabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: true,
            model: 'foo',
            renderer: {
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        disabled: true,
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when field is required', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()

      this.set('bunsenModel', {
        properties: {
          foo: {
            items: {
              enum: ['bar', 'baz'],
              type: 'string'
            },
            type: 'array'
          }
        },
        required: ['foo'],
        type: 'object'
      })
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['bar', 'baz'],
        label: 'Foo'
      })

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

  describe('when user checks checkbox', function () {
    beforeEach(function () {
      this.$(selectors.frost.checkbox.input.enabled)
        .eq(0).trigger('click')
      this.$(selectors.frost.checkbox.input.enabled)
        .eq(1).trigger('click')
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenCheckboxArrayRendererWithState('foo', {
        checked: true,
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when value is set to pre-check checkboxes', function () {
    beforeEach(function () {
      this.set('value', {
        foo: ['bar', 'baz']
      })
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        checked: true,
        items: ['bar', 'baz'],
        label: 'Foo'
      })
    })
  })

  describe('when labels is set to override the model enum', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: false,
            model: 'foo',
            renderer: {
              name: 'checkbox-array',
              labels: {
                bar: 'BAR',
                baz: 'BAZ'
              }
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectBunsenCheckboxArrayRendererWithState('foo', {
        items: ['BAR', 'BAZ'],
        label: 'Foo'
      })
    })
  })
})
