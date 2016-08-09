import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | text',
  {
    integration: true
  },
  function () {
    let props, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()

      props = {
        bunsenModel: {
          properties: {
            foo: {
              type: 'string'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        disabled: undefined,
        onChange: sandbox.spy(),
        onValidation: sandbox.spy(),
        showAllErrors: undefined
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        disabled=disabled
        onChange=onChange
        onValidation=onValidation
        showAllErrors=showAllErrors
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.text),
        'renders a bunsen text input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.text.input.enabled)

      expect(
        $input,
        'renders an enabled text input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.text.input.enabled)

        expect(
          $input,
          'renders an enabled text input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'renders collapsible handle'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.text.input.enabled)

        expect(
          $input,
          'renders an enabled text input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.text.input.enabled)

        expect(
          $input,
          'renders an enabled text input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.text.input.enabled)

        expect(
          $input,
          'renders an enabled text input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.text.type.date.input.enabled)

        expect(
          $input,
          'renders an enabled date input'
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
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.text.input.enabled),
          'renders an enabled text input'
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
          this.$(selectors.frost.text.input.disabled),
          'renders a disabled text input'
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
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.text.input.enabled),
          'renders an enabled text input'
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
              model: 'foo'
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.text.input.disabled),
          'renders a disabled text input'
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
        props.onValidation = sandbox.spy()
        this.set('onValidation', props.onValidation)

        this.$(selectors.frost.text.input.enabled)
          .val(input)
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.text.input.enabled),
          'renders an enabled text input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.text.input.enabled).val(),
          'input maintains user input value'
        )
          .to.equal(`${input}`)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({
            foo: input
          })

        expect(
          props.onValidation.callCount,
          'does not provide consumer with validation results via onValidation() property'
        )
          .to.equal(0)
      })
    })

    describe('when field is required', function () {
      beforeEach(function () {
        props.onValidation = sandbox.spy()

        this.setProperties({
          bunsenModel: {
            properties: {
              foo: {
                type: 'string'
              }
            },
            required: ['foo'],
            type: 'object'
          },
          onValidation: props.onValidation
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.text.input.enabled),
          'renders an enabled text input'
        )
          .to.have.length(1)

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.error),
            'adds error class to input'
          )
            .to.have.length(1)

          const actual = this.$(selectors.bunsen.errorMessage.text).text().trim()
          const expected = 'Field is required.'

          expect(
            actual,
            'presents user with validation error message'
          )
            .to.equal(expected)

          expect(
            props.onValidation.callCount,
            'does not inform consumer of validation results'
          )
            .to.equal(0)
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
      })

      describe('applies literal string read transform', function () {
        const input = 'Matt'

        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.text.input.enabled)
            .val(input)
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled).val(),
            'renders transformed value in text input'
          )
            .to.equal('Matthew')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onChange.lastCall.args[0],
            'informs consumer of change'
          )
            .to.eql({
              foo: input
            })

          expect(
            props.onValidation.callCount,
            'does not provide consumer with validation results via onValidation() property'
          )
            .to.equal(0)
        })
      })

      describe('applies regex string read transform', function () {
        const input = 'Chris'

        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.text.input.enabled)
            .val(input)
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled).val(),
            'renders transformed value in text input'
          )
            .to.equal('Christopher')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onChange.lastCall.args[0],
            'informs consumer of change'
          )
            .to.eql({
              foo: input
            })

          expect(
            props.onValidation.callCount,
            'does not provide consumer with validation results via onValidation() property'
          )
            .to.equal(0)
        })
      })

      describe('applies literal string write transform', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.text.input.enabled)
            .val('Johnathan')
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled).val(),
            'renders transformed value in text input'
          )
            .to.equal('John')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onChange.lastCall.args[0],
            'informs consumer of change'
          )
            .to.eql({
              foo: 'John'
            })

          expect(
            props.onValidation.callCount,
            'does not provide consumer with validation results via onValidation() property'
          )
            .to.equal(0)
        })
      })

      describe('applies regex string write transform', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.text.input.enabled)
            .val('Alexander')
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled),
            'renders an enabled text input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.text.input.enabled).val(),
            'renders transformed value in text input'
          )
            .to.equal('Alex')

          expect(
            this.$(selectors.error),
            'does not have any validation errors'
          )
            .to.have.length(0)

          expect(
            props.onChange.lastCall.args[0],
            'informs consumer of change'
          )
            .to.eql({
              foo: 'Alex'
            })

          expect(
            props.onValidation.callCount,
            'does not provide consumer with validation results via onValidation() property'
          )
            .to.equal(0)
        })
      })
    })
  }
)
