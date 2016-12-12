import {expect} from 'chai'
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
    expect(
      this.$(selectors.bunsen.collapsible.handle),
      'does not render collapsible handle'
    )
      .to.have.length(0)

    expect(
      this.$(selectors.bunsen.renderer.checkboxArray),
      'renders a bunsen checkbox-array input'
    )
      .to.have.length(1)

    const $input = this.$(selectors.frost.checkbox.input.enabled)

    expect(
      $input,
      'renders an enabled checkbox-array input'
    )
      .to.have.length(2)

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
              name: 'checkbox-array'
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
        this.$(selectors.bunsen.renderer.checkboxArray),
        'renders a bunsen checkbox-array input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.checkbox.input.enabled)

      expect(
        $input,
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
              name: 'checkbox-array'
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
        this.$(selectors.bunsen.renderer.checkboxArray),
        'renders a bunsen checkbox-array input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.checkbox.input.enabled)

      expect(
        $input,
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
              name: 'checkbox-array'
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
        this.$(selectors.bunsen.renderer.checkboxArray),
        'renders a bunsen checkbox-array input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.checkbox.input.enabled)

      expect(
        $input,
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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

  describe('when form explicitly enabled', function () {
    beforeEach(function () {
      this.set('disabled', false)
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
        'renders a disabled checkbox-array input'
      )
        .to.have.length(2)

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
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
              name: 'checkbox-array'
            }
          }
        ],
        type: 'form',
        version: '2.0'
      })
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.frost.checkbox.input.disabled),
        'renders a disabled checkbox-array input'
      )
        .to.have.length(2)

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
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.renderer.checkboxArray),
        'renders a bunsen checkbox-array input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.frost.checkbox.input.enabled),
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
  })

  describe('when user checks checkbox', function () {
    beforeEach(function () {
      this.$(selectors.frost.checkbox.input.enabled)
        .trigger('click')
    })

    it('renders as expected', function () {
      expect(
        this.$(selectors.bunsen.collapsible.handle),
        'does not render collapsible handle'
      )
        .to.have.length(0)

      expect(
        this.$(selectors.bunsen.renderer.checkboxArray),
        'renders a bunsen checkbox-array input'
      )
        .to.have.length(1)

      const $input = this.$(selectors.frost.checkbox.input.enabled)

      expect(
        $input,
        'renders an enabled checkbox-array input'
      )
        .to.have.length(2)

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
})
