import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import {expectBunsenInputToHaveError} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | url',
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
        bunsenView: {
          cells: [
            {
              model: 'foo',
              renderer: {
                name: 'url'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        },
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
        this.$(selectors.bunsen.renderer.url),
        'renders a bunsen url input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.url.input.enabled)

      expect(
        $input,
        'renders an enabled url input'
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
              model: 'foo',
              renderer: {
                name: 'url'
              }
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
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.url.input.enabled)

        expect(
          $input,
          'renders an enabled url input'
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
              model: 'foo',
              renderer: {
                name: 'url'
              }
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
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.url.input.enabled)

        expect(
          $input,
          'renders an enabled url input'
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
              model: 'foo',
              renderer: {
                name: 'url'
              }
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
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.url.input.enabled)

        expect(
          $input,
          'renders an enabled url input'
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
              placeholder: 'Foo bar',
              renderer: {
                name: 'url'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.url.input.enabled)

        expect(
          $input,
          'renders an enabled url input'
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

    describe('when form explicitly enabled', function () {
      beforeEach(function () {
        this.set('disabled', false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.url.input.enabled),
          'renders an enabled url input'
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
          this.$(selectors.frost.url.input.disabled),
          'renders a disabled url input'
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
                name: 'url'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.url.input.enabled),
          'renders an enabled url input'
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
                name: 'url'
              }
            }
          ],
          type: 'form',
          version: '2.0'
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.frost.url.input.disabled),
          'renders a disabled url input'
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

        this.$(selectors.frost.url.input.enabled)
          .val(input)
          .trigger('input')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.url.input.enabled),
          'renders an enabled url input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.url.input.enabled).val(),
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
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = props.onValidation.lastCall.args[0]

        expect(
          validationResult.errors,
          'has no validation errors'
        )
          .to.eql([])

        expect(
          validationResult.warnings,
          'has no validation warnings'
        )
          .to.eql([])
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
          this.$(selectors.bunsen.renderer.url),
          'renders a bunsen url input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.url.input.enabled),
          'renders an enabled url input'
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
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
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
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
          )
            .to.have.length(1)

          expectBunsenInputToHaveError('foo', 'Field is required.')

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
              renderer: {
                name: 'url'
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
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.url.input.enabled)
            .val(input)
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled).val(),
            'renders transformed value in url input'
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
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors,
            'has no validation errors'
          )
            .to.eql([])

          expect(
            validationResult.warnings,
            'has no validation warnings'
          )
            .to.eql([])
        })
      })

      describe('value matches regex string read transform', function () {
        const input = 'Chris'

        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.url.input.enabled)
            .val(input)
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled).val(),
            'renders transformed value in url input'
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
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors,
            'has no validation errors'
          )
            .to.eql([])

          expect(
            validationResult.warnings,
            'has no validation warnings'
          )
            .to.eql([])
        })
      })

      describe('applies literal string write transform', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.url.input.enabled)
            .val('Johnathan')
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled).val(),
            'renders transformed value in url input'
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
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors,
            'has no validation errors'
          )
            .to.eql([])

          expect(
            validationResult.warnings,
            'has no validation warnings'
          )
            .to.eql([])
        })
      })

      describe('applies regex string write transform', function () {
        beforeEach(function () {
          props.onValidation = sandbox.spy()
          this.set('onValidation', props.onValidation)

          this.$(selectors.frost.url.input.enabled)
            .val('Alexander')
            .trigger('input')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.url),
            'renders a bunsen url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled),
            'renders an enabled url input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.url.input.enabled).val(),
            'renders transformed value in url input'
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
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = props.onValidation.lastCall.args[0]

          expect(
            validationResult.errors,
            'has no validation errors'
          )
            .to.eql([])

          expect(
            validationResult.warnings,
            'has no validation warnings'
          )
            .to.eql([])
        })
      })
    })
  }
)
