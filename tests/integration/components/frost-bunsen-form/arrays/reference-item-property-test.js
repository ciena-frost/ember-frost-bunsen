import {expect} from 'chai'
import {
  expectWithState as expectTextInputWithState,
  find as findTextInputs
} from 'ember-frost-core/test-support/frost-text'
import {describe, it} from 'mocha'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / array reference item property', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              settings: {
                type: 'object',
                properties: {
                  moo: {type: 'string'},
                  boo: {type: 'string'}
                }
              }
            }
          }
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          children: [
            {model: 'boo'},
            {model: 'moo'}
          ],
          model: 'foo.0.settings'
        }
      ],
      type: 'form',
      version: '2.0'
    },
    value: {
      foo: [
        {
          settings: {
            boo: 'test1',
            moo: 'test2'
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

    expectTextInputWithState('bunsenForm-foo.0.settings.boo-input', {
      placeholder: '',
      value: 'test1'
    })

    expectTextInputWithState('bunsenForm-foo.0.settings.moo-input', {
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
      .to.equal('Boo')

    expect(
      $labels.last().text().trim(),
      'renders expected label text'
    )
      .to.equal('Moo')
  })
})
