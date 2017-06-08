import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenTextRendererWithState,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState,
  fillInBunsenTextRenderer
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / text', function () {
  const ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'string'
        }
      },
      type: 'object'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenTextRendererWithState('foo', {label: 'Foo'})
    expectOnValidationState(ctx, {count: 1})
  })

  describe('when hideLabel is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: true,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: null})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when hideLabel is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            hideLabel: false,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: 'FooBar Baz'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: true,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: false,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when placeholder defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            placeholder: 'Foo bar'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {
        label: 'Foo',
        placeholder: 'Foo bar'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when type defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'string',
              type: 'date'
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
      expectBunsenTextRendererWithState('foo', {
        label: 'Foo'
        // type: 'date' // TODO: figure out why this fails
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when form disabled', function () {
    beforeEach(function () {
      this.set('disabled', true)
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {
        disabled: true,
        label: 'Foo'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when property explicitly enabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: false,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when property disabled in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            disabled: true,
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {
        disabled: true,
        label: 'Foo'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when user inputs value', function () {
    const input = 'bar'

    beforeEach(function () {
      ctx.props.onValidation.reset()
      fillInBunsenTextRenderer('foo', input)
      return wait()
    })

    it('functions as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenTextRendererWithState('foo', {
        label: 'Foo',
        value: `${input}`
      })
      expectOnChangeState(ctx, {foo: input})
      expectOnValidationState(ctx, {count: 1})
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
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
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

    describe('when showAllErrors is false', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', false)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {label: 'Foo'})
        expectOnValidationState(ctx, {count: 0})
      })
    })

    describe('when showAllErrors is true', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', true)
        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {
          error: 'Field is required.',
          label: 'Foo'
        })
        expectOnValidationState(ctx, {count: 0})
      })
    })
  })

  describe('transforms', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            transforms: {
              read: [
                {
                  from: '^Chris$',
                  regex: true,
                  to: 'Christopher'
                },
                {
                  from: 'Matt',
                  to: 'Matthew'
                }
              ],
              write: [
                {
                  from: '^Alexander$',
                  regex: true,
                  to: 'Alex'
                },
                {
                  from: 'Johnathan',
                  to: 'John'
                }
              ]
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    describe('applies literal string read transform', function () {
      const input = 'Matt'

      beforeEach(function () {
        ctx.props.onValidation.reset()
        fillInBunsenTextRenderer('foo', input)
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {
          label: 'Foo',
          value: 'Matthew'
        })
        expectOnChangeState(ctx, {foo: input})
        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('applies regex string read transform', function () {
      const input = 'Chris'

      beforeEach(function () {
        ctx.props.onValidation.reset()
        fillInBunsenTextRenderer('foo', input)
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {
          label: 'Foo',
          value: 'Christopher'
        })
        expectOnChangeState(ctx, {foo: input})
        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('applies literal string write transform', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        fillInBunsenTextRenderer('foo', 'Johnathan')
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {
          label: 'Foo',
          value: 'John'
        })
        expectOnChangeState(ctx, {foo: 'John'})
        expectOnValidationState(ctx, {count: 1})
      })
    })

    describe('applies regex string write transform', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        fillInBunsenTextRenderer('foo', 'Alexander')
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenTextRendererWithState('foo', {
          label: 'Foo',
          value: 'Alex'
        })
        expectOnChangeState(ctx, {foo: 'Alex'})
        expectOnValidationState(ctx, {count: 1})
      })
    })
  })

  describe('when options passed in', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'string',
              options: {
                bar: true,
                baz: 'spam',
                foo: 1,
                readonly: true
              }
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
      expectBunsenTextRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
      expect($hook('bunsenForm-foo-input').prop('readonly')).to.equal(true)
    })
  })
})
