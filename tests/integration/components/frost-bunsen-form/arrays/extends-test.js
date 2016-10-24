import {expect} from 'chai'
import {initialize} from 'ember-hook'
import {describeComponent} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, it} from 'mocha'
import sinon from 'sinon'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

describeComponent(
  'frost-bunsen-form',
  'Integration: Component | frost-bunsen-form | array extends',
  {
    integration: true
  },
  function () {
    let props, sandbox

    beforeEach(function () {
      initialize()
      sandbox = sinon.sandbox.create()

      props = {
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
      }

      this.setProperties(props)

      this.render(hbs`{{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        value=value
      }}`)
    })

    afterEach(function () {
      sandbox.restore()
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
  }
)
