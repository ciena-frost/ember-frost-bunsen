import {expect} from 'chai'
import {initialize} from 'ember-hook'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {
  expectTextInputWithState,
  findTextInputs
} from 'dummy/tests/helpers/ember-frost-core'

import selectors from 'dummy/tests/helpers/selectors'

describe('Integration: Component | frost-bunsen-form | array reference item property', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let props, sandbox

  beforeEach(function () {
    initialize()
    sandbox = sinon.sandbox.create()

    props = {
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
