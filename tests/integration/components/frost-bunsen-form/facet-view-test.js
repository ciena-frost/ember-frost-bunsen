import {expect} from 'chai'
import Ember from 'ember'
const {$} = Ember
import {$hook, initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'

import {
  expectSelectWithState,
  expectTextInputWithState,
  fillIn,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {generateFacetView} from 'ember-frost-bunsen/utils'

describe('Integration: Component / frost-bunsen-form / facet view', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox

  beforeEach(function () {
    initialize()
    sandbox = sinon.sandbox.create()

    const bunsenModel = {
      properties: {
        bar: {
          enum: ['alpha', 'bravo', 'charlie'],
          type: 'string'
        },
        foo: {
          type: 'string'
        }
      },
      type: 'object'
    }

    const facetDef = [
      {
        model: 'foo'
      },
      {
        label: 'Baz',
        model: 'bar'
      }
    ]

    const bunsenView = generateFacetView(facetDef)

    props = {
      bunsenModel,
      bunsenView,
      onChange: sandbox.spy(),
      onValidation: sandbox.spy()
    }

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-form
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      onChange=onChange
      onValidation=onValidation
    }}`)

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0)

    expect(
      this.$(selectors.bunsen.section.clearableButton),
      'renders clearable button for each input'
    )
      .to.have.length(2)

    const $headings = this.$(selectors.bunsen.section.heading)

    expect(
      $headings,
      'renders correct number of headings'
    )
      .to.have.length(2)

    expect(
      $headings.first().text().trim(),
      'renders correct heading text for first input'
    )
      .to.equal('Foo')

    expect(
      $headings.last().text().trim(),
      'renders correct heading text for second input'
    )
      .to.equal('Baz')

    expect(
      this.$(selectors.bunsen.renderer.text),
      'renders a bunsen text input'
    )
      .to.have.length(1)

    expect(
      this.$(selectors.bunsen.renderer.select),
      'renders a bunsen select input'
    )
      .to.have.length(1)

    expect(
      findTextInputs(),
      'renders one text input'
    )
      .to.have.length(1)

    expectTextInputWithState('bunsenForm-foo-input', {
      placeholder: '',
      value: ''
    })

    expect(
      $('.frost-select'),
      'renders one select input'
    )
      .to.have.length(1)

    expectSelectWithState($hook('bunsenForm-bar').find('.frost-select'), {
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
      'informs consumer there are no errors'
    )
      .to.equal(0)

    expect(
      validationResult.warnings.length,
      'informs consumer there are no warnings'
    )
      .to.equal(0)
  })

  describe('when user inputs value', function () {
    const input = 'spam'

    beforeEach(function () {
      props.onChange.reset()
      props.onValidation.reset()
      fillIn('bunsenForm-foo-input', input)
      return wait()
    })

    it('renders as expected', function () {
      expectCollapsibleHandles(0)

      expect(
        this.$(selectors.bunsen.section.clearableButton),
        'renders clearable button for each input'
      )
        .to.have.length(2)

      const $headings = this.$(selectors.bunsen.section.heading)

      expect(
        $headings,
        'renders correct number of headings'
      )
        .to.have.length(2)

      expect(
        $headings.first().text().trim(),
        'renders correct heading text for first input'
      )
        .to.equal('Foo')

      expect(
        $headings.last().text().trim(),
        'renders correct heading text for second input'
      )
        .to.equal('Baz')

      expect(
        this.$(selectors.bunsen.renderer.text),
        'renders a bunsen text input'
      )
        .to.have.length(1)

      expect(
        this.$(selectors.bunsen.renderer.select),
        'renders a bunsen select input'
      )
        .to.have.length(1)

      expect(
        findTextInputs(),
        'renders one text input'
      )
        .to.have.length(1)

      expectTextInputWithState('bunsenForm-foo-input', {
        placeholder: '',
        value: input
      })

      expect(
        $('.frost-select'),
        'renders one select input'
      )
        .to.have.length(1)

      expectSelectWithState($hook('bunsenForm-bar').find('.frost-select'), {
        text: ''
      })

      expect(
        this.$(selectors.error),
        'does not have any validation errors'
      )
        .to.have.length(0)

      expect(
        props.onChange.callCount,
        'only informs consumer of one change'
      )
        .to.equal(1)

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

    describe('user presses clear button', function () {
      beforeEach(function () {
        props.onChange.reset()
        props.onValidation.reset()

        this.$(selectors.bunsen.section.clearableButton).first().click()

        return wait()
      })

      it('renders as expected', function () {
        expectCollapsibleHandles(0)

        expect(
          this.$(selectors.bunsen.section.clearableButton),
          'renders clearable button for each input'
        )
          .to.have.length(2)

        const $headings = this.$(selectors.bunsen.section.heading)

        expect(
          $headings,
          'renders correct number of headings'
        )
          .to.have.length(2)

        expect(
          $headings.first().text().trim(),
          'renders correct heading text for first input'
        )
          .to.equal('Foo')

        expect(
          $headings.last().text().trim(),
          'renders correct heading text for second input'
        )
          .to.equal('Baz')

        expect(
          this.$(selectors.bunsen.renderer.text),
          'renders a bunsen text input'
        )
          .to.have.length(1)

        expect(
          this.$(selectors.bunsen.renderer.select),
          'renders a bunsen select input'
        )
          .to.have.length(1)

        expect(
          findTextInputs(),
          'renders one text input'
        )
          .to.have.length(1)

        expectTextInputWithState('bunsenForm-foo-input', {
          placeholder: '',
          value: ''
        })

        expect(
          $('.frost-select'),
          'renders one select input'
        )
          .to.have.length(1)

        expectSelectWithState($hook('bunsenForm-bar').find('.frost-select'), {
          text: ''
        })

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expect(
          props.onChange.callCount,
          'only informs consumer of one change'
        )
          .to.equal(1)

        expect(
          props.onChange.lastCall.args[0],
          'informs consumer of change'
        )
          .to.eql({})

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
  })
})
