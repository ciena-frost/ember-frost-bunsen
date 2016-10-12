import {expect} from 'chai'
import Ember from 'ember'
const {RSVP, run} = Ember
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'
import {initialize} from 'ember-hook'
import {expectBunsenInputToHaveError} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | renderer | select model query',
  {
    integration: true
  },
  function () {
    let props, sandbox, resolver

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      initialize()
      resolver = {}

      this.register('service:store', Ember.Service.extend({
        query () {
          return new RSVP.Promise((resolve, reject) => {
            resolver.resolve = resolve
            resolver.reject = reject
          })
        }
      }))

      props = {
        bunsenModel: {
          properties: {
            foo: {
              modelType: 'bar',
              query: {
                baz: 'alpha'
              },
              type: 'string'
            }
          },
          type: 'object'
        },
        bunsenView: undefined,
        disabled: undefined,
        hook: 'bunsenForm',
        onChange: sandbox.spy(),
        onError: sandbox.spy(),
        onValidation: sandbox.spy(),
        showAllErrors: undefined
      }

      this.setProperties(props)

      this.render(hbs`
        {{frost-select-outlet}}
        {{frost-bunsen-form
          bunsenModel=bunsenModel
          bunsenView=bunsenView
          disabled=disabled
          hook=hook
          onChange=onChange
          onError=onError
          onValidation=onValidation
          showAllErrors=showAllErrors
        }}
      `)
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('when query succeeds', function () {
      beforeEach(function () {
        run(() => {
          resolver.resolve([
            Ember.Object.create({
              label: 'bar',
              value: 'bar'
            }),
            Ember.Object.create({
              label: 'baz',
              value: 'baz'
            })
          ])
        })
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.collapsible.handle),
          'does not render collapsible handle'
        )
          .to.have.length(0)

        expect(
          this.$(selectors.bunsen.renderer.select.input),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        const $input = this.$(selectors.frost.select.input.enabled)

        expect(
          $input,
          'renders an enabled select input'
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

      describe('when expanded/opened', function () {
        beforeEach(function () {
          this.$(selectors.bunsen.renderer.select.arrow).click()
        })

        it('renders as expected', function () {
          const $items = this.$(selectors.bunsen.renderer.select.items)

          expect(
            $items,
            'has correct number of options'
          )
            .to.have.length(2)

          const $firstItem = $items.eq(0)

          expect(
            $firstItem.text().trim(),
            'first item has expected text'
          )
            .to.equal('bar')

          const $secondItem = $items.eq(1)

          expect(
            $secondItem.text().trim(),
            'second item has expected text'
          )
            .to.equal('baz')
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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.collapsible.handle),
            'does not render collapsible handle'
          )
            .to.have.length(0)

          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          const $input = this.$(selectors.frost.select.input.enabled)

          expect(
            $input,
            'renders an enabled select input'
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
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          const $input = this.$(selectors.frost.select.input.enabled)

          expect(
            $input,
            'renders an enabled select input'
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
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          const $input = this.$(selectors.frost.select.input.enabled)

          expect(
            $input,
            'renders an enabled select input'
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
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          const $input = this.$(selectors.frost.select.input.enabled)

          expect(
            $input,
            'renders an enabled select input'
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
            this.$(selectors.frost.select.input.enabled),
            'renders an enabled select input'
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
            this.$(selectors.frost.select.input.disabled),
            'renders a disabled select input'
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
            this.$(selectors.frost.select.input.enabled),
            'renders an enabled select input'
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
            this.$(selectors.frost.select.input.disabled),
            'renders a disabled select input'
          )
            .to.have.length(1)

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
        })

        it('renders as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.select.input),
            'renders a bunsen select input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.select.input.enabled),
            'renders an enabled select input'
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
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.select.input.enabled),
              'renders an enabled select input'
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
              this.$(selectors.bunsen.renderer.select.input),
              'renders a bunsen select input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.select.input.enabled),
              'renders an enabled select input'
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
    })

    describe('when query fails', function () {
      beforeEach(function () {
        run(() => {
          resolver.reject({
            responseJSON: {
              errors: [{
                detail: 'It done broke, son.'
              }]
            }
          })
        })
      })

      it('should call onError', function () {
        expect(this.get('onError').lastCall.args).to.eql(['foo', [{
          path: 'foo',
          message: 'It done broke, son.'
        }]])
      })
    })
  }
)
