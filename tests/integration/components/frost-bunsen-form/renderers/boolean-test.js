import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  clickBunsenBooleanRenderer,
  expectBunsenBooleanRendererWithState,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / boolean', function () {
  const ctx = setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'boolean'
        }
      },
      type: 'object'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)
    expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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
      expectBunsenBooleanRendererWithState('foo', {label: null})
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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
      expectBunsenBooleanRendererWithState('foo', {label: 'FooBar Baz'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to true in view', function () {
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when collapsible set to false in view', function () {
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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
      expectBunsenBooleanRendererWithState('foo', {
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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
      expectBunsenBooleanRendererWithState('foo', {
        disabled: true,
        label: 'Foo'
      })
      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when user checks checkbox', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()
      clickBunsenBooleanRenderer('foo')
      return wait()
    })

    it('functions as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenBooleanRendererWithState('foo', {
        checked: true,
        label: 'Foo'
      })
      expectOnChangeState(ctx, {foo: true})
      expectOnValidationState(ctx, {count: 1})
    })

    describe('when user unchecks checkbox', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        clickBunsenBooleanRenderer('foo')
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenBooleanRendererWithState('foo', {
          label: 'Foo'
        })
        expectOnChangeState(ctx, {foo: false})
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
            type: 'boolean'
          }
        },
        required: ['foo'],
        type: 'object'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
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

    describe('when user checks checkbox', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        clickBunsenBooleanRenderer('foo')
        return wait()
      })

      it('functions as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenBooleanRendererWithState('foo', {
          checked: true,
          label: 'Foo'
        })
        expectOnChangeState(ctx, {foo: true})
        expectOnValidationState(ctx, {count: 1})
      })

      describe('when user unchecks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          clickBunsenBooleanRenderer('foo')
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
          expectOnChangeState(ctx, {foo: false})
          expectOnValidationState(ctx, {count: 1})
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
        expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
        expectOnValidationState(ctx, {count: 0})
      })

      describe('when user checks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          clickBunsenBooleanRenderer('foo')
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenBooleanRendererWithState('foo', {
            checked: true,
            label: 'Foo'
          })
          expectOnChangeState(ctx, {foo: true})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when user unchecks checkbox', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()
            clickBunsenBooleanRenderer('foo')
            return wait()
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
            expectOnChangeState(ctx, {foo: false})
            expectOnValidationState(ctx, {count: 1})
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

      it('renders as expected', function () {
        expectCollapsibleHandles(0)
        expectBunsenBooleanRendererWithState('foo', {
          error: 'Field is required.',
          label: 'Foo'
        })
        expectOnValidationState(ctx, {count: 0})
      })

      describe('when user checks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()
          clickBunsenBooleanRenderer('foo')
          return wait()
        })

        it('functions as expected', function () {
          expectCollapsibleHandles(0)
          expectBunsenBooleanRendererWithState('foo', {
            checked: true,
            label: 'Foo'
          })
          expectOnChangeState(ctx, {foo: true})
          expectOnValidationState(ctx, {count: 1})
        })

        describe('when user unchecks checkbox', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()
            clickBunsenBooleanRenderer('foo')
            return wait()
          })

          it('functions as expected', function () {
            expectCollapsibleHandles(0)
            expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
            expectOnChangeState(ctx, {foo: false})
            expectOnValidationState(ctx, {count: 1})
          })
        })
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
              name: 'boolean',
              options: {
                bar: true,
                baz: 'spam',
                foo: 1,
                inputId: 'jibJab'
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
      expectBunsenBooleanRendererWithState('foo', {label: 'Foo'})
      expectOnValidationState(ctx, {count: 1})
      expect($hook('bunsenForm-foo-checkbox-input').prop('id')).to.equal('jibJab')
    })
  })
})
