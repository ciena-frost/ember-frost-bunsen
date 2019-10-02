import { find } from '@ember/test-helpers';
import {expect} from 'chai'
import {expectWithState as expectSelectWithState} from 'ember-frost-core/test-support/frost-select'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {
  expectBunsenInputToHaveError,
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / renderer / multi-select enum', function () {
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
            name: 'multi-select'
          }
        }
      ],
      type: 'form',
      version: '2.0'
    },
    hook: 'my-form'
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0, 'my-form')

    expect(
      this.$(selectors.bunsen.renderer.multiSelect),
      'renders a bunsen multi-select input'
    )
      .to.have.length(1)

    expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
      text: ''
    })

    expect(
      this.$(selectors.bunsen.label).text().trim(),
      'renders expected label text'
    )
      .to.equal('Foo')

    expect(
      this.$(selectors.error),
      'does not have any validation errors'
    )
      .to.have.length(0)
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'my-form')

      expect(
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('FooBar Baz')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
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
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1, 'my-form')

      expect(
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
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
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'my-form')

      expect(
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.bunsen.label).text().trim(),
        'renders expected label text'
      )
        .to.equal('Foo')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when placeholder defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            placeholder: 'Foo bar',
            renderer: {
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: 'Foo bar'
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx, {count: 1})
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
      return wait()
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when form disabled', function () {
    beforeEach(function () {
      this.set('disabled', true)
      return wait()
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        disabled: true,
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
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
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
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
              name: 'multi-select'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        disabled: true,
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
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

      return wait()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.multiSelect),
        'renders a bunsen multi-select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

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
        expect(
          this.$(selectors.bunsen.renderer.multiSelect),
          'renders a bunsen multi-select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: ''
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

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
        expect(
          this.$(selectors.bunsen.renderer.multiSelect),
          'renders a bunsen multi-select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          error: true,
          text: ''
        })

        expectBunsenInputToHaveError('foo', 'Field is required.', 'my-form')
        expectOnValidationState(ctx, {count: 0})
      })
    })
  })

  describe('when value is set', function () {
    beforeEach(function () {
      this.set('value', {foo: ['bar', 'baz']})
      return wait()
    })

    it('should display those values', function () {
      expect(find('.frost-select-text').textContent.trim()).to.equal('bar, baz')
    })

    // Note: this breaks if the value passed to frost-multi-select is immutable
    describe('when value is set to another array with the same values', function () {
      beforeEach(function () {
        this.set('value', {foo: ['baz', 'bar']})
        return wait()
      })

      it('should still display the old values', function () {
        expect(find('.frost-select-text').textContent.trim()).to.equal('bar, baz')
      })
    })
  })
})
