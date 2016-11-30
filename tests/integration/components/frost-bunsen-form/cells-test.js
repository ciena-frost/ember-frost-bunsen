import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, it} from 'mocha'
import sinon from 'sinon'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

[
  {
    cells: [
      {
        model: 'foo'
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cellDefinitions: {
      foo: {
        model: 'foo'
      }
    },
    cells: [
      {
        extends: 'foo'
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cells: [
      {
        children: [
          {
            model: 'foo'
          }
        ]
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cellDefinitions: {
      foo: {
        model: 'foo'
      }
    },
    cells: [
      {
        children: [
          {
            extends: 'foo'
          }
        ]
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cellDefinitions: {
      foo: {
        children: [
          {
            model: 'foo'
          }
        ]
      }
    },
    cells: [
      {
        extends: 'foo'
      }
    ],
    type: 'form',
    version: '2.0'
  }
]
  .forEach((bunsenView) => {
    describeComponent(
      'frost-bunsen-form',
      'Integration: Component | frost-bunsen-form | cells',
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
            bunsenView,
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
            this.$(selectors.bunsen.renderer.text),
            'renders a bunsen text input'
          )
            .to.have.length(1)

          expect(
            findTextInputs(),
            'renders one text input'
          )
            .to.have.length(1)

          expectTextInputWithState('bunsenForm-foo-input', {
            placeholder: ''
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
      }
    )
  })
