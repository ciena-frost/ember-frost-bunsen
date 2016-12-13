import {expect} from 'chai'

import {
  expectBunsenInputToHaveError,
  expectCollapsibleHandles,
  expectOnValidationState
} from 'dummy/tests/helpers/ember-frost-bunsen'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-form / renderer / password', function () {
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
            name: 'password'
          }
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)

    expect(
      this.$(selectors.bunsen.renderer.password.input),
      'renders a bunsen password input'
    )
      .to.have.length(1)

    const $input = this.$(selectors.frost.password.input.enabled)

    expect(
      $input,
      'renders an enabled password input'
    )
      .to.have.length(1)

    expect(
      $input.prop('placeholder'),
      'does not have placeholder text'
    )
      .to.equal('')

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

    expectOnValidationState(ctx.props.onValidation, {count: 1})
  })

  describe('when label defined in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'FooBar Baz',
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.password.input.enabled)

      expect(
        $input,
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        $input.prop('placeholder'),
        'does not have placeholder text'
      )
        .to.equal('')

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

      expectOnValidationState(ctx.props.onValidation, {count: 1})
    })
  })

  describe('when collapsible is set to true in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: true,
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(1)

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.password.input.enabled)

      expect(
        $input,
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        $input.prop('placeholder'),
        'does not have placeholder text'
      )
        .to.equal('')

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

      expectOnValidationState(ctx.props.onValidation, {count: 1})
    })
  })

  describe('when collapsible is set to false in view', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            collapsible: false,
            model: 'foo',
            renderer: {
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)

      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.password.input.enabled)

      expect(
        $input,
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        $input.prop('placeholder'),
        'does not have placeholder text'
      )
        .to.equal('')

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

      expectOnValidationState(ctx.props.onValidation, {count: 1})
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
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.password.input.enabled)

      expect(
        $input,
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        $input.prop('placeholder'),
        'has expected placeholder text'
      )
        .to.equal('Foo bar')

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx.props.onValidation, {count: 1})
    })
  })

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.password.input.enabled),
        'renders an enabled password input'
      )
        .to.have.length(1)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.password.input.disabled),
        'renders a disabled password input'
      )
        .to.have.length(1)

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
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.password.input.enabled),
        'renders an enabled password input'
      )
        .to.have.length(1)

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
              name: 'password'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.password.input.disabled),
        'renders a disabled password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when user inputs value', function () {
    const input = 'bar'

    beforeEach(function () {
      ctx.props.onValidation.reset()

      this.$(selectors.frost.password.input.enabled)
        .val(input)
        .trigger('input')
    })

    it('functions as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.password.input.enabled),
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.password.input.enabled).val(),
        'input maintains user input value'
      )
        .to.equal(`${input}`)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expect(
        ctx.props.onChange.lastCall.args[0],
        'informs consumer of change'
      )
        .to.eql({
          foo: input
        })

      expectOnValidationState(ctx.props.onValidation, {count: 1})
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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.password.input),
        'renders a bunsen password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.password.input.enabled),
        'renders an enabled password input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expectOnValidationState(ctx.props.onValidation, {
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx.props.onValidation, {count: 0})
      })
    })

    describe('when showAllErrors is true', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', true)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expectBunsenInputToHaveError('foo', 'Field is required.')
        expectOnValidationState(ctx.props.onValidation, {count: 0})
      })
    })
  })

  describe('transforms', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'password'
            },
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
    })

    describe('value matches literal string read transform', function () {
      const input = 'Matt'

      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.password.input.enabled)
          .val(input)
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled).val(),
          'renders transformed value in password input'
        )
          .to.equal('Matthew')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          ctx.props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({
            foo: input
          })

        expectOnValidationState(ctx.props.onValidation, {count: 1})
      })
    })

    describe('value matches regex string read transform', function () {
      const input = 'Chris'

      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.password.input.enabled)
          .val(input)
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled).val(),
          'renders transformed value in password input'
        )
          .to.equal('Christopher')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          ctx.props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({
            foo: input
          })

        expectOnValidationState(ctx.props.onValidation, {count: 1})
      })
    })

    describe('applies literal string write transform', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.password.input.enabled)
          .val('Johnathan')
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled).val(),
          'renders transformed value in password input'
        )
          .to.equal('John')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          ctx.props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({
            foo: 'John'
          })

        expectOnValidationState(ctx.props.onValidation, {count: 1})
      })
    })

    describe('applies regex string write transform', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.password.input.enabled)
          .val('Alexander')
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.password.input),
          'renders a bunsen password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled),
          'renders an enabled password input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.password.input.enabled).val(),
          'renders transformed value in password input'
        )
          .to.equal('Alex')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          ctx.props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({
            foo: 'Alex'
          })

        expectOnValidationState(ctx.props.onValidation, {count: 1})
      })
    })
  })
})
