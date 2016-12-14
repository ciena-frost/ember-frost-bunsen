import {expect} from 'chai'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-form / ensure one section heading', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        foo: {
          properties: {
            bar: {
              type: 'string'
            }
          },
          type: 'object'
        }
      },
      type: 'object'
    },
    bunsenView: {
      cellDefinitions: {
        main: {
          label: 'Test',
          children: [
            {
              model: 'bar'
            }
          ]
        }
      },
      cells: [
        {
          children: [
            {
              extends: 'main',
              model: 'foo'
            }
          ]
        }
      ],
      type: 'form',
      version: '2.0'
    }
  })

  it('renders as expected', function () {
    const $headings = this.$(selectors.bunsen.section.heading)

    expect(
      $headings,
      'only has one section heading'
    )
      .to.have.length(1)

    expect(
      $headings.eq(0).text().trim(),
      'renders expected section heading'
    )
      .to.equal('Test')
  })
})
