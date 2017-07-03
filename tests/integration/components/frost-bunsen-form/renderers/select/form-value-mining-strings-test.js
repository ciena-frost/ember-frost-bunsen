import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook, initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectBunsenInputToHaveError,
  expectCollapsibleHandles,
  expectOnChangeState,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import {expectSelectWithState} from 'dummy/tests/helpers/ember-frost-core'
import selectors from 'dummy/tests/helpers/selectors'

function render () {
  this.render(hbs`
    {{frost-select-outlet hook='selectOutlet'}}
    {{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      disabled=disabled
      hook=hook
      onChange=onChange
      onValidation=onValidation
      showAllErrors=showAllErrors
      value=value
    }}
  `)
}

describe('Integration: Component / frost-bunsen-form / renderer / select form value mining strings', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox

  beforeEach(function () {
    initialize()
    sandbox = sinon.sandbox.create()

    props = {
      bunsenModel: {
        properties: {
          bar: {
            items: {
              type: 'string'
            },
            type: 'array'
          },
          foo: {
            labelAttribute: 'name',
            recordsPath: 'bar',
            type: 'string',
            valueAttribute: 'id'
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo'
          }
        ],
        type: 'form',
        version: '2.0'
      },
      disabled: undefined,
      hook: 'my-form',
      onChange: sandbox.spy(),
      onValidation: sandbox.spy(),
      showAllErrors: undefined,
      value: undefined
    }

    this.setProperties(props)

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
    props = null
    sandbox = null
  })

  describe('when no initial value', function () {
    beforeEach(function () {
      this.set('value', {
        bar: ['bar', 'baz', 'spam']
      })

      render.call(this)

      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0, 'my-form')

      expect(
        this.$(selectors.bunsen.renderer.select.input),
        'renders a bunsen select input'
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

      expectOnValidationState({props}, {count: 1})
    })

    describe('when expanded/opened', function () {
      beforeEach(function () {
        $hook('my-form-foo').find('.frost-select').click()
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          // focused: true, // Not staying focused in test for some reason
          items: ['bar', 'baz', 'spam'],
          opened: true,
          text: ''
        })
      })

      describe('when filtered', function () {
        beforeEach(function () {
          $('.frost-select-dropdown .frost-text-input')
            .val('sp')
            .trigger('input')

          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            // focused: true, // Not staying focused in test for some reason
            items: ['spam'],
            opened: true,
            text: ''
          })
        })
      })

      describe('when first option selected', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          expectOnChangeState({props}, {
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })

          expectOnValidationState({props}, {count: 1})
        })
      })

      describe('when middle option selected', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 1}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'baz'
          })

          expectOnChangeState({props}, {
            bar: ['bar', 'baz', 'spam'],
            foo: 'baz'
          })

          expectOnValidationState({props}, {count: 1})
        })
      })

      describe('when last option selected', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'spam'
          })

          expectOnChangeState({props}, {
            bar: ['bar', 'baz', 'spam'],
            foo: 'spam'
          })

          expectOnValidationState({props}, {count: 1})
        })
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
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
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

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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
        expectCollapsibleHandles(1, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
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

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
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

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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
        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
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

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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
              model: 'foo'
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
              model: 'foo'
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
        props.onValidation = sandbox.spy()

        this.setProperties({
          bunsenModel: {
            properties: {
              foo: {
                enum: [
                  'bar',
                  'baz'
                ],
                type: 'string'
              }
            },
            required: ['foo'],
            type: 'object'
          },
          onValidation: props.onValidation
        })

        return wait()
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
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

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there is one error'
        )
          .to.equal(1)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
      })

      describe('when showAllErrors is false', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()

          this.setProperties({
            onValidation: props.onValidation,
            showAllErrors: false
          })

          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
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

          expect(
            props.onValidation.callCount,
            'does not inform consumer of validation results'
          )
            .to.equal(0)
        })
      })

      describe('when showAllErrors is true', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()

          this.setProperties({
            onValidation: props.onValidation,
            showAllErrors: true
          })

          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            error: true,
            text: ''
          })

          expectBunsenInputToHaveError('foo', 'Field is required.', 'my-form')

          expect(
            props.onValidation.callCount,
            'does not inform consumer of validation results'
          )
            .to.equal(0)
        })
      })
    })
  })

  describe('when initial value', function () {
    beforeEach(function () {
      this.set('value', {
        bar: ['bar', 'baz', 'spam'],
        foo: 'bar'
      })

      return wait()
    })

    describe('when expanded/opened', function () {
      beforeEach(function () {
        render.call(this)
        $hook('my-form-foo').find('.frost-select').click()
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          // focused: true, // Not staying focused in test for some reason
          items: ['bar', 'baz', 'spam'],
          opened: true,
          text: 'bar'
        })

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })
      })

      describe('when filtered', function () {
        beforeEach(function () {
          $('.frost-select-dropdown .frost-text-input')
            .val('sp')
            .trigger('input')

          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            // focused: true, // Not staying focused in test for some reason
            items: ['spam'],
            opened: true,
            text: 'bar'
          })
        })
      })

      describe('when first option selected (initial value)', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          expect(
            props.onChange.callCount,
            'does not trigger change since value is aleady selected'
          )
            .to.equal(0)

          expectOnValidationState({props}, {count: 0})
        })
      })

      describe('when middle option selected', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 1}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'baz'
          })

          expectOnChangeState({props}, {
            bar: ['bar', 'baz', 'spam'],
            foo: 'baz'
          })

          expectOnValidationState({props}, {count: 1})
        })
      })

      describe('when last option selected', function () {
        beforeEach(function () {
          props.onChange.reset()
          props.onValidation.reset()
          $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'spam'
          })

          expectOnChangeState({props}, {
            bar: ['bar', 'baz', 'spam'],
            foo: 'spam'
          })

          expectOnValidationState({props}, {count: 1})
        })
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

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
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

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(1, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
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

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0, 'my-form')

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
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

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
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

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
          })

        expect(
          props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors.length,
          'informs consumer there are no errors'
        )
          .to.equal(0)

        expect(
          validationResult.warnings.length,
          'informs consumer there are no warnings'
        )
          .to.equal(0)
      })
    })

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
        render.call(this)
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
        })

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
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
        render.call(this)
        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: 'bar'
        })

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
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
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          text: 'bar'
        })

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
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
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })

        render.call(this)

        return wait()
      })

      it('renders as expected', function () {
        expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
          disabled: true,
          text: 'bar'
        })

        const formValue = props.onChange.lastCall.args[0]

        expect(
          formValue,
          'provides consumer with expected form value'
        )
          .to.eql({
            bar: ['bar', 'baz', 'spam'],
            foo: 'bar'
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
        props.bunsenModel.required = ['foo']
        this.set('bunsenModel', props.bunsenModel)
        return wait()
      })

      describe('showAllErrors not set', function () {
        beforeEach(function () {
          render.call(this)
          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(0)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when showAllErrors is false', function () {
        beforeEach(function () {
          this.set('showAllErrors', false)
          render.call(this)
          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)
        })
      })

      describe('when showAllErrors is true', function () {
        beforeEach(function () {
          this.set('showAllErrors', true)
          render.call(this)
          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)
        })
      })
    })
  })

  describe('when default value', function () {
    beforeEach(function () {
      props.bunsenModel.properties.foo.default = 'bar'
      this.set('bunsenModel', props.bunsenModel)
      render.call(this)
      return wait()
    })

    it('renders as expected', function () {
      expectOnChangeState({props}, {
        foo: 'bar'
      })
    })

    describe('set property to be mined', function () {
      beforeEach(function () {
        props.onValidation.reset()

        this.set('value', {
          bar: ['bar', 'baz', 'spam'],
          foo: 'bar'
        })

        return wait()
      })

      describe('when expanded/opened', function () {
        beforeEach(function () {
          render.call(this)
          $hook('my-form-foo').find('.frost-select').click()
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            // focused: true, // Not staying focused in test for some reason
            items: ['bar', 'baz', 'spam'],
            opened: true,
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })
        })

        describe('when filtered', function () {
          beforeEach(function () {
            $('.frost-select-dropdown .frost-text-input')
              .val('sp')
              .trigger('input')

            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              // focused: true, // Not staying focused in test for some reason
              items: ['spam'],
              opened: true,
              text: 'bar'
            })
          })
        })

        describe('when first option selected (default value)', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo-item', {index: 0}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'bar'
            })

            expect(
              props.onChange.callCount,
              'does not trigger change since value is aleady selected'
            )
              .to.equal(0)

            expectOnValidationState({props}, {count: 0})
          })
        })

        describe('when middle option selected', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo-item', {index: 1}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'baz'
            })

            expectOnChangeState({props}, {
              bar: ['bar', 'baz', 'spam'],
              foo: 'baz'
            })

            expectOnValidationState({props}, {count: 1})
          })
        })

        describe('when last option selected', function () {
          beforeEach(function () {
            props.onChange.reset()
            props.onValidation.reset()
            $hook('my-form-foo-item', {index: 2}).trigger('mousedown')
            return wait()
          })

          it('renders as expected', function () {
            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'spam'
            })

            expectOnChangeState({props}, {
              bar: ['bar', 'baz', 'spam'],
              foo: 'spam'
            })

            expectOnValidationState({props}, {count: 1})
          })
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

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
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

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(4)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(0)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
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

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(1, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
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

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(4)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(0)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
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

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expectCollapsibleHandles(0, 'my-form')

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
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

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(4)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(0)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
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

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
            })

          expect(
            props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(4)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors.length,
            'informs consumer there are no errors'
          )
            .to.equal(0)

          expect(
            validationResult.warnings.length,
            'informs consumer there are no warnings'
          )
            .to.equal(0)
        })
      })

      describe('when form explicitly enabled', function () {
        beforeEach(function () {
          this.set('disabled', false)
          render.call(this)
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
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
          render.call(this)
          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            disabled: true,
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
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
                model: 'foo'
              }
            ],
            type: 'form',
            version: '2.0'
          })

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
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
                model: 'foo'
              }
            ],
            type: 'form',
            version: '2.0'
          })

          render.call(this)

          return wait()
        })

        it('renders as expected', function () {
          expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
            disabled: true,
            text: 'bar'
          })

          const formValue = props.onChange.lastCall.args[0]

          expect(
            formValue,
            'provides consumer with expected form value'
          )
            .to.eql({
              bar: ['bar', 'baz', 'spam'],
              foo: 'bar'
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
          props.bunsenModel.required = ['foo']
          this.set('bunsenModel', props.bunsenModel)
          return wait()
        })

        describe('showAllErrors not set', function () {
          beforeEach(function () {
            render.call(this)
            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'bar'
            })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            const formValue = props.onChange.lastCall.args[0]

            expect(
              formValue,
              'provides consumer with expected form value'
            )
              .to.eql({
                bar: ['bar', 'baz', 'spam'],
                foo: 'bar'
              })

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(3)

            const validationResult = props.onValidation.lastCall.args[0]

            expect(
              validationResult.errors.length,
              'informs consumer there are no errors'
            )
              .to.equal(0)

            expect(
              validationResult.warnings.length,
              'informs consumer there are no warnings'
            )
              .to.equal(0)
          })
        })

        describe('when showAllErrors is false', function () {
          beforeEach(function () {
            this.set('showAllErrors', false)
            render.call(this)
            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'bar'
            })

            const formValue = props.onChange.lastCall.args[0]

            expect(
              formValue,
              'provides consumer with expected form value'
            )
              .to.eql({
                bar: ['bar', 'baz', 'spam'],
                foo: 'bar'
              })

            expect(
              this.$(selectors.error),
              'does not have any validation errors'
            )
              .to.have.length(0)

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(4)
          })
        })

        describe('when showAllErrors is true', function () {
          beforeEach(function () {
            this.set('showAllErrors', true)
            render.call(this)
            return wait()
          })

          it('renders as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expectSelectWithState($hook('my-form-foo').find('.frost-select'), {
              text: 'bar'
            })

            const formValue = props.onChange.lastCall.args[0]

            expect(
              formValue,
              'provides consumer with expected form value'
            )
              .to.eql({
                bar: ['bar', 'baz', 'spam'],
                foo: 'bar'
              })

            expect(
              props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(4)
          })
        })
      })
    })
  })
})
