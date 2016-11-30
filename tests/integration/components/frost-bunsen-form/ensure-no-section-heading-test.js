import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'
import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | ensure no section heading',
  {
    integration: true
  },
  function () {
    beforeEach(function () {
      this.set('bunsenModel', {
        properties: {
          foo: {
            properties: {
              bar: {
                type: 'string'
              },
              baz: {
                items: {
                  properties: {
                    spam: {
                      type: 'string'
                    }
                  },
                  type: 'object'
                },
                type: 'array'
              }
            },
            type: 'object'
          }
        },
        type: 'object'
      })
    })

    ;[
      {
        cells: [
          {
            collapsible: true,
            hideLabel: true,
            model: 'foo',
            children: [
              {
                model: 'bar'
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
            arrayOptions: {
              itemCell: {
                children: [
                  {
                    model: 'spam'
                  }
                ]
              }
            },
            hideLabel: true,
            model: 'foo.baz'
          }
        ],
        type: 'form',
        version: '2.0'
      }
    ]
      .forEach((bunsenView, index) => {
        describe(`view ${index}`, function () {
          beforeEach(function () {
            this.set('bunsenView', bunsenView)

            this.render(hbs`{{frost-bunsen-form
              bunsenModel=bunsenModel
              bunsenView=bunsenView
            }}`)
          })

          it('renders as expected', function () {
            const $headings = this.$(selectors.bunsen.section.heading)

            expect(
              $headings,
              'has no section heading'
            )
              .to.have.length(0)
          })
        })
      })
  }
)
