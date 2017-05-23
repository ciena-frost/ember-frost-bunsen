import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {stubStore} from 'dummy/tests/helpers/ember-test-utils/ember-data'

describe('Integration: Component / frost-bunsen-form / renderer / multi-select options', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  let onClick, sandbox, store

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    store = stubStore(this, sandbox)
    onClick = sandbox.stub()

    this.setProperties({
      bunsenModel: {
        properties: {
          foo: {
            items: {
              type: 'string'
            },
            modelType: 'node',
            query: {
              'filter': '[baz]=$filter'
            },
            type: 'array',
          }
        },
        type: 'object'
      },
      bunsenView: {
        cells: [
          {
            model: 'foo',
            renderer: {
              name: 'multi-select',
              options: {
                onClick
              }
            }
          }
        ],
        type: 'form',
        version: '2.0'
      },
      hook: 'my-form'
    })

    this.render(hbs`
      {{frost-select-outlet hook='selectOutlet'}}
      {{frost-bunsen-form
        bunsenModel=bunsenModel
        bunsenView=bunsenView
        disabled=disabled
        hook=hook
        onChange=onChange
        onValidation=onValidation
        showAllErrors=showAllErrors
        value=value
      }}
    `)

    return wait()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when clicked', function () {
    beforeEach(function () {
      $hook('my-form-foo').find('.frost-select').click()
      return wait()
    })

    it('should call onClick passed in via renderer options', function () {
      expect(onClick).to.have.callCount(1)
    })
  })

  describe('when opened and filtered', function () {
    beforeEach(function () {
      $hook('my-form-foo').find('.frost-select').click()
      return wait().then(() => {
        $hook('my-form-foo-list-input-input').val('42').trigger('input')
        return wait()
      })
    })

    it('should call store.query with expected args', function () {
      expect(store.query).to.have.been.calledWith('node', {filter: '[baz]=42'})
    })
  })
})
