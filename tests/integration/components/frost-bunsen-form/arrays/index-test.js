import {expect} from 'chai'
import {describe, it} from 'mocha'

import {expectOnValidationState} from 'dummy/tests/helpers/ember-frost-bunsen'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

[
  {
    cells: [
      {
        model: 'foo.0.bar'
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cells: [
      {
        model: 'foo[0].bar'
      }
    ],
    type: 'form',
    version: '2.0'
  },
  {
    cellDefinitions: {
      foo: {
        model: 'foo.0.bar'
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
    cellDefinitions: {
      foo: {
        model: 'foo[0].bar'
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
            model: 'foo.0.bar'
          }
        ]
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
            model: 'foo[0].bar'
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
        model: 'foo.0.bar'
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
        model: 'foo[0].bar'
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
            model: 'foo.0.bar'
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
  },
  {
    cellDefinitions: {
      foo: {
        children: [
          {
            model: 'foo[0].bar'
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
    describe('Integration: Component / frost-bunsen-form / array index reference test', function () {
      const ctx = setupFormComponentTest({
        bunsenModel: {
          properties: {
            foo: {
              items: {
                properties: {
                  bar: {
                    type: 'string'
                  }
                },
                type: 'object'
              },
              type: 'array'
            }
          },
          type: 'object'
        },
        bunsenView
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

        expectTextInputWithState('bunsenForm-foo.0.bar-input', {
          placeholder: ''
        })

        expect(
          this.$(selectors.bunsen.label).text().trim(),
          'renders expected label text'
        )
          .to.equal('Bar')

        expect(
          this.$(selectors.error),
          'does not have any validation errors'
        )
          .to.have.length(0)

        expectOnValidationState(ctx, {count: 1})
      })
    })
  })
