import {expect} from 'chai'
import {expectBunsenInputToHaveError} from 'dummy/tests/helpers/ember-frost-bunsen'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {beforeEach, describe, it} from 'mocha'

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
    expect(
      this.$(selectors.bunsen.collapsible.handle),
      'does not render collapsible handle'
    )
      .to.have.length(0)

    expect(
      this.$(selectors.bunsen.renderer.boolean),
      'renders a bunsen boolean input'
    )
      .to.have.length(1)

    expect(
      this.$(selectors.frost.checkbox.input.enabled),
      'renders an enabled checkbox input'
    )
      .to.have.length(1)

    expect(
      this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
      'checkbox is unchecked'
    )
      .to.be.equal(false)

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
      ctx.props.onValidation.callCount,
      'informs consumer of validation results'
    )
      .to.equal(1)

    const validationResult = ctx.props.onValidation.lastCall.args[0]

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
        this.$(selectors.bunsen.renderer.boolean),
        'renders a bunsen boolean input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
        'checkbox is unchecked'
      )
        .to.be.equal(false)

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
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'renders collapsible handle'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.boolean),
        'renders a bunsen boolean input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
        'checkbox is unchecked'
      )
        .to.be.equal(false)

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
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.boolean),
        'renders a bunsen boolean input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
        'checkbox is unchecked'
      )
        .to.be.equal(false)

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
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

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
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
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
        this.$(selectors.frost.checkbox.input.disabled),
        'renders a disabled checkbox input'
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
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
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
        this.$(selectors.frost.checkbox.input.disabled),
        'renders a disabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)
    })
  })

  describe('when user checks checkbox', function () {
    beforeEach(function () {
      ctx.props.onValidation.reset()

      this.$(selectors.frost.checkbox.input.enabled)
        .trigger('click')
    })

    it('functions as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.boolean),
        'renders a bunsen boolean input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
        'checkbox is checked'
      )
        .to.be.equal(true)

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
          foo: true
        })

      expect(
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

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

    describe('when user unchecks checkbox', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.checkbox.input.enabled)
          .trigger('click')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.boolean),
          'renders a bunsen boolean input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'renders an enabled checkbox input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
          'checkbox is unchecked'
        )
          .to.be.equal(false)

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
            foo: false
          })

        expect(
          ctx.props.onValidation.callCount,
          'informs consumer of validation results'
        )
          .to.equal(1)

        const validationResult = ctx.props.onValidation.lastCall.args[0]

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.boolean),
        'renders a bunsen boolean input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
        'checkbox is unchecked'
      )
        .to.be.equal(false)

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expect(
        ctx.props.onValidation.callCount,
        'informs consumer of validation results'
      )
        .to.equal(1)

      const validationResult = ctx.props.onValidation.lastCall.args[0]

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

    describe('when user checks checkbox', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()

        this.$(selectors.frost.checkbox.input.enabled)
          .trigger('click')
      })

      it('functions as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.boolean),
          'renders a bunsen boolean input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'renders an enabled checkbox input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
          'checkbox is checked'
        )
          .to.be.equal(true)

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
            foo: true
          })

        const validationResult = ctx.props.onValidation.lastCall.args[0]

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

      describe('when user unchecks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()

          this.$(selectors.frost.checkbox.input.enabled)
            .trigger('click')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
            'checkbox is unchecked'
          )
            .to.be.equal(false)

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
              foo: false
            })

          expect(
            ctx.props.onValidation.callCount,
            'informs consumer of validation results'
          )
            .to.equal(1)

          const validationResult = ctx.props.onValidation.lastCall.args[0]

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
    })

    describe('when showAllErrors is false', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', false)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.boolean),
          'renders a bunsen boolean input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'renders an enabled checkbox input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
          'checkbox is unchecked'
        )
          .to.be.equal(false)

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          ctx.props.onValidation.callCount,
          'does not inform consumer of validation results'
        )
          .to.equal(0)
      })

      describe('when user checks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()

          this.$(selectors.frost.checkbox.input.enabled)
            .trigger('click')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
            'checkbox is checked'
          )
            .to.be.equal(true)

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
              foo: true
            })

          const validationResult = ctx.props.onValidation.lastCall.args[0]

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

        describe('when user unchecks checkbox', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()

            this.$(selectors.frost.checkbox.input.enabled)
              .trigger('click')
          })

          it('functions as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.boolean),
              'renders a bunsen boolean input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.checkbox.input.enabled),
              'renders an enabled checkbox input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
              'checkbox is unchecked'
            )
              .to.be.equal(false)

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
                foo: false
              })

            expect(
              ctx.props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(1)

            const validationResult = ctx.props.onValidation.lastCall.args[0]

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
      })
    })

    describe('when showAllErrors is true', function () {
      beforeEach(function () {
        ctx.props.onValidation.reset()
        this.set('showAllErrors', true)
      })

      it('renders as expected', function () {
        expect(
          this.$(selectors.bunsen.renderer.boolean),
          'renders a bunsen boolean input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled),
          'renders an enabled checkbox input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
          'checkbox is unchecked'
        )
          .to.be.equal(false)

        expectBunsenInputToHaveError('foo', 'Field is required.')

        expect(
          ctx.props.onValidation.callCount,
          'does not inform consumer of validation results'
        )
          .to.equal(0)
      })

      describe('when user checks checkbox', function () {
        beforeEach(function () {
          ctx.props.onValidation.reset()

          this.$(selectors.frost.checkbox.input.enabled)
            .trigger('click')
        })

        it('functions as expected', function () {
          expect(
            this.$(selectors.bunsen.renderer.boolean),
            'renders a bunsen boolean input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled),
            'renders an enabled checkbox input'
          )
            .to.have.length(1)

          expect(
            this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
            'checkbox is checked'
          )
            .to.be.equal(true)

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
              foo: true
            })

          const validationResult = ctx.props.onValidation.lastCall.args[0]

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

        describe('when user unchecks checkbox', function () {
          beforeEach(function () {
            ctx.props.onValidation.reset()

            this.$(selectors.frost.checkbox.input.enabled)
              .trigger('click')
          })

          it('functions as expected', function () {
            expect(
              this.$(selectors.bunsen.renderer.boolean),
              'renders a bunsen boolean input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.checkbox.input.enabled),
              'renders an enabled checkbox input'
            )
              .to.have.length(1)

            expect(
              this.$(selectors.frost.checkbox.input.enabled).prop('checked'),
              'checkbox is unchecked'
            )
              .to.be.equal(false)

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
                foo: false
              })

            expect(
              ctx.props.onValidation.callCount,
              'informs consumer of validation results'
            )
              .to.equal(1)

            const validationResult = ctx.props.onValidation.lastCall.args[0]

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
      })
    })
  })
})
