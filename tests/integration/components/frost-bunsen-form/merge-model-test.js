import {expect} from 'chai'
import {describe, it} from 'mocha'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-form / merge models', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          properties: {
            bar: {
              properties: {
                baz: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          children: [
            {
              model: 'baz'
            }
          ],
          model: 'foo.bar'
        }
      ],
      type: 'form',
      version: '2.0'
    }
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

    expectTextInputWithState('bunsenForm-foo.bar.baz-input', {
      placeholder: ''
    })

    expect(
      this.$(selectors.bunsen.label).text().trim(),
      'renders expected label text'
    )
      .to.equal('Baz')
  })
})
