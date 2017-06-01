import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-input-select', function () {
  setupComponentTest('frost-bunsen-input-select', {
    unit: true
  })
  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenId: 'foo',
      bunsenModel: {
        type: 'string'
      },
      bunsenView: {},
      cellConfig: {
        renderer: {
          name: 'select'
        }
      },
      onChange: function () {},
      onError: function () {},
      registerForFormValueChanges: function () {}
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('listData()', function () {
    let bunsenModel, cellConfig
    beforeEach(function () {
      bunsenModel = {
        enum: ['item1', 'item2']
      }
      cellConfig = {
        renderer: {
          options: {
            debounceInterval: 500
          }
        }
      }
      component.reopen({
        bunsenModel,
        cellConfig
      })
      component.get('listData')
    })

    it('does not mutate the cellConfig', function () {
      expect(cellConfig).to.eql({
        renderer: {
          options: {
            debounceInterval: 500
          }
        }
      })
    })
  })
})
