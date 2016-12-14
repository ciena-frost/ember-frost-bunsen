import {expect} from 'chai'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {describe, it} from 'mocha'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component / frost-bunsen-form / array extends', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          items: {
            properties: {
              baz: {
                properties: {
                  spam: {
                    properties: {
                      alpha: {
                        type: 'string'
                      }
                    },
                    type: 'object'
                  }
                },
                type: 'object'
              },
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
    bunsenView: {
      version: '2.0',
      type: 'detail',
      cells: [
        {
          arrayOptions: {
            itemCell: {
              children: [
                {
                  model: 'bar'
                },
                {
                  extends: 'spam'
                }
              ]
            }
          },
          model: 'foo'
        }
      ],
      cellDefinitions: {
        spam: {
          model: 'baz.spam',
          children: [
            {
              model: 'alpha'
            }
          ]
        }
      }
    },
    value: {
      foo: [
        {
          bar: 'test1',
          baz: {
            spam: {
              alpha: 'test2'
            }
          }
        }
      ]
    }
  })

  it('renders as expected', function () {
    expect(
      this.$(selectors.bunsen.renderer.text),
      'renders two bunsen text inputs'
    )
      .to.have.length(2)

    expect(
      findTextInputs(),
      'renders two text inputs'
    )
      .to.have.length(2)

    expectTextInputWithState('bunsenForm-foo.0.bar-input', {
      placeholder: '',
      value: 'test1'
    })

    expectTextInputWithState('bunsenForm-foo.0.baz.spam.alpha-input', {
      placeholder: '',
      value: 'test2'
    })

    const $labels = this.$(selectors.bunsen.label)

    expect(
      $labels,
      'renders two labels'
    )
      .to.have.length(2)

    expect(
      $labels.first().text().trim(),
      'renders expected label text'
    )
      .to.equal('Bar')

    expect(
      $labels.last().text().trim(),
      'renders expected label text'
    )
      .to.equal('Alpha')
  })
})
