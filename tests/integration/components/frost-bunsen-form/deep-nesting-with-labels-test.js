import {expect} from 'chai'
import selectors from 'dummy/tests/helpers/selectors'
import {setupFormComponentTest} from 'dummy/tests/helpers/utils'
import {describe, it} from 'mocha'

describe('Integration: Component / frost-bunsen-form / deep nesting with labels', function () {
  setupFormComponentTest({
    bunsenModel: {
      properties: {
        nested: {
          properties: {
            foo: {
              properties: {
                foosValue: {
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
              children: [
                {
                  children: [
                    {
                      label: 'value',
                      model: 'foosValue'
                    }
                  ],
                  label: 'Foo',
                  model: 'foo'
                }
              ],
              label: 'Main',
              model: 'nested'
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
      'only has two section headings'
    )
      .to.have.length(2)

    expect(
      $headings.first().text().trim(),
      'renders expected section heading'
    )
      .to.equal('Main')

    expect(
      $headings.last().text().trim(),
      'renders expected section heading'
    )
      .to.equal('Foo')
  })
})
