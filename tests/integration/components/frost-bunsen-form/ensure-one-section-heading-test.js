import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, it} from 'mocha'
import sinon from 'sinon'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | ensure one section heading',
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
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
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
  }
)
