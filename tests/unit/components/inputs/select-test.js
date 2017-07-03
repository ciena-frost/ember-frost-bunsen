import {expect} from 'chai'
import Ember from 'ember'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {returnPromiseWithArgs} from 'dummy/tests/helpers/ember-test-utils/ember-data'
import utils from 'ember-frost-bunsen/list-utils'

const {run} = Ember

describe('Unit: frost-bunsen-input-select', function () {
  setupComponentTest('frost-bunsen-input-select', {
    unit: true
  })

  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenId: 'name',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      onChange () {},
      onError () {},
      registerForFormValueChanges () {},
      state: Ember.Object.create({})
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('hasQueryChanged', function () {
    let modelQuery, component, formValue, oldFormValue

    beforeEach(function () {
      modelQuery = {
        foo: '${bar}'
      }
      formValue = {
        bar: 'baz'
      }
      oldFormValue = {
        bar: 'bar'
      }

      component = this.subject({
        initialized: true,
        bunsenId: ''
      })
    })

    describe('when query is undefined', function () {
      it('returns false when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, undefined)).to.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, undefined)).to.equal(false)
      })
    })

    describe('when query has no dependencies', function () {
      it('returns false when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, {name: '$filter'})).to.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, {name: '$filter'})).to.equal(false)
      })
    })

    describe('when queries have dependencies', function () {
      it('returns false when queries are equal', function () {
        expect(component.hasQueryChanged(oldFormValue, oldFormValue, modelQuery)).to.equal(false)
      })

      it('returns true when queries mismatch', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
      })
    })

    describe('when queries have dependencies but either one is missing', function () {
      describe('when oldFormValue is missing dependencies', function () {
        beforeEach(function () {
          delete oldFormValue.bar
        })

        it('returns false when formValue is also missing dependencies', function () {
          delete formValue.bar
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(false)
        })
        it('returns true when formValue is not missing dependencies', function () {
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
        })
      })

      describe('when formValue is missing dependencies', function () {
        beforeEach(function () {
          delete formValue.bar
        })

        it('returns false when oldFormValue is also missing dependencies', function () {
          delete oldFormValue.bar
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(false)
        })

        it('returns true when oldFormValue is not missing dependencies', function () {
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
        })
      })
    })
  })

  describe('needsInitialItems', function () {
    describe('when options is not initialized', function () {
      beforeEach(function () {
        component.set('itemsInitialized', false)
      })

      it('returns true when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialItems()).to.equal(true)
      })

      it('returns true when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialItems()).to.equal(true)
      })

      it('returns true when list data is provided', function () {
        component.set('cellConfig', {
          renderer: {
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }]
            }
          }
        })

        expect(component.needsInitialItems()).to.equal(true)
      })
    })

    describe('when options is initialized', function () {
      beforeEach(function () {
        component.set('itemsInitialized', true)
      })

      it('returns false when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialItems()).to.equal(false)
      })

      it('returns false when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialItems()).to.equal(false)
      })

      it('returns false when list data is provided', function () {
        component.set('cellConfig', {
          renderer: {
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }]
            }
          }
        })

        expect(component.needsInitialItems()).to.equal(false)
      })
    })
  })

  describe('listData', function () {
    let cellConfig, bunsenModel, listData

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

    describe('when data is available from either enums or custom overrides', function () {
      beforeEach(function () {
        bunsenModel = {
          enum: ['enum_value']
        }

        cellConfig = {
          renderer: {
            options: {
              data: [{
                label: 'Custom',
                value: 'custom'
              }],
              none: {
                label: 'None',
                present: false,
                value: ''
              }
            }
          }
        }
      })

      it('returns the only custom data when it is present and enums is present', function () {
        component.setProperties({
          bunsenModel,
          cellConfig
        })

        expect(component.get('listData')).to.eql([
          {
            label: 'Custom',
            value: 'custom'
          }
        ])
      })

      it('returns an empty list when enum and custom data is not present', function () {
        expect(component.get('listData')).to.eql([])
      })

      it('prepends the enums with the `none` option when present', function () {
        cellConfig.renderer.options.none.present = true
        delete cellConfig.renderer.options.data
        component.setProperties({
          bunsenModel,
          cellConfig
        })
        expect(component.get('listData')).to.eql([
          {
            label: 'None',
            value: ''
          },
          {
            label: 'enum_value',
            value: 'enum_value'
          }
        ])
      })

      it('prepends the custom data with the `none` option when present', function () {
        cellConfig.renderer.options.none.present = true
        component.setProperties({
          cellConfig
        })
        expect(component.get('listData')).to.eql([
          {
            label: 'None',
            value: ''
          },
          {
            label: 'Custom',
            value: 'custom'
          }
        ])
      })

      it('only returns the `none` options when no enum and no custom data is present', function () {
        cellConfig.renderer.options.none.present = true
        delete cellConfig.renderer.options.data
        component.setProperties({
          cellConfig
        })
        expect(component.get('listData')).to.eql([
          {
            label: 'None',
            value: ''
          }
        ])
      })

      it('defaults none.label and none.value', function () {
        cellConfig.renderer.options.none = {
          present: true
        }
        delete cellConfig.renderer.options.data
        component.setProperties({
          cellConfig
        })
        expect(component.get('listData')).to.eql([
          {
            label: 'None',
            value: ''
          }
        ])
      })
    })
  })

  describe('updateItems', function () {
    describe('when called multiple times at once', function () {
      let firstCall, secondCall
      beforeEach(function () {
        sandbox.stub(utils, 'getOptions')
        returnPromiseWithArgs(utils.getOptions) // Make sure task does not complete
        firstCall = component.get('updateItems').perform({value: component.get('formValue')})
        secondCall = component.get('updateItems').perform({value: component.get('formValue')})
      })

      it('should only have one task running', function () {
        expect(component.get('updateItems.concurrency')).to.equal(1)
      })

      it('should cancel the first call', function () {
        expect(firstCall.get('isCanceled')).to.equal(true)
      })

      it('should have second call running', function () {
        expect(secondCall.get('isRunning')).to.equal(true)
      })
    })
  })

  describe('formValueChanged', function () {
    describe('when query references change', function () {
      beforeEach(function () {
        component.setProperties({
          bunsenId: 'bar',
          onChange: sandbox.stub(),
          bunsenModel: {
            query: {
              foo: '${./foo}'
            }
          },
          cellConfig: {
            model: 'bar'
          },
          formValue: {
            foo: 'value1'
          },
          updateItems: {
            perform: sandbox.stub()
          }
        })
      })

      it('clears the selection when items are initialized and value is set', function (done) {
        component.setProperties({
          itemsInitialized: true,
          formValue: {
            foo: 'value1',
            bar: 'value1'
          },
          options: [{
            data: 'value1',
            label: 'value1'
          }]
        })
        component.formValueChanged({
          foo: 'value2'
        })
        run.next(() => {
          expect(component.onChange).to.have.been.calledWith('bar', undefined)
          expect(component.get('options')).to.eql([])
          done()
        })
      })

      it('does not clear the selection when items are not initialized', function (done) {
        component.setProperties({
          formValue: {
            foo: 'value1',
            bar: 'value1'
          },
          options: [{
            data: 'value1',
            label: 'value1'
          }]
        })
        component.formValueChanged({
          foo: 'value2'
        })
        run.next(() => {
          expect(component.onChange).not.to.have.been.calledWith('bar', undefined)
          expect(component.get('options')).not.to.eql([])
          done()
        })
      })

      it('does not clear selection when value is not set', function (done) {
        component.setProperties({
          itemsInitialized: true,
          formValue: {
            foo: 'value1'
          },
          options: [{
            data: 'value1',
            label: 'value1'
          }]
        })
        component.formValueChanged({
          foo: 'value2'
        })
        run.next(() => {
          expect(component.onChange).not.to.have.been.calledWith('bar', undefined)
          expect(component.get('options')).not.to.eql([])
          done()
        })
      })
    })
  })
})
