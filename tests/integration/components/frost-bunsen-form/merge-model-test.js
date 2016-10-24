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
  'Integration: Component | frost-bunsen-form | merge models',
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
  }
)
