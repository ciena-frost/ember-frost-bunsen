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
    let bunsenModel, cellConfig, listData
    describe('when model has enum', function () {
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
        listData = component.get('listData')
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

      it('returns the appropriate list data', function () {
        expect(listData).to.eql([
          {
            label: 'item1',
            value: 'item1'
          }, {
            label: 'item2',
            value: 'item2'
          }
        ])
      })
    })

    describe('when cellConfig has overrides', function () {
      beforeEach(function () {
        cellConfig = {
          renderer: {
            options: {
              data: [{
                label: 'data1',
                value: 'data1'
              }, {
                label: 'data2',
                value: 'data2'
              }]
            }
          }
        }
        component.reopen({
          bunsenModel: {},
          cellConfig
        })
        listData = component.get('listData')
      })

      it('does not mutate the cellConfig', function () {
        expect(cellConfig).to.eql({
          renderer: {
            options: {
              data: [{
                label: 'data1',
                value: 'data1'
              }, {
                label: 'data2',
                value: 'data2'
              }]
            }
          }
        })
      })

      it('returns the appropriate list data', function () {
        expect(listData).to.eql([
          {
            label: 'data1',
            value: 'data1'
          }, {
            label: 'data2',
            value: 'data2'
          }
        ])
      })
    })
  })
})
