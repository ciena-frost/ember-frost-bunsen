import {expect} from 'chai'
import Ember from 'ember'
const {set, setProperties} = Ember

import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-input-autocomplete', function () {
  setupComponentTest('frost-bunsen-input-autocomplete', {
    unit: true,
    needs: ['service:ajax']
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

  it('should parseValue correctly', function () {
    const data = 'data'
    const parsedData = component.parseValue(data)
    expect(parsedData).to.equal(data)
  })

  it('should not be doing async be default', function () {
    expect(component.get('isAsyncGet'), 'isAsyncGet to be false').to.equal(false)
    expect(component.get('asyncLoading'), 'asyncLoading to be false').to.equal(false)
  })

  describe('When bunsen model has modelType', function () {
    beforeEach(function () {
      setProperties(component, {bunsenModel: {modelType: 'country'},
        'updateItems.isRunning': true,
        _emptyFilter: false
      })
    })

    it('should have async loading', function () {
      expect(component.get('isAsyncGet'), 'isAsyncGet to be true').to.equal(true)
      expect(component.get('asyncLoading'), 'asyncLoading to be true').to.equal(true)
    })

    it('should not be loading when task is not running', function () {
      set(component, 'updateItems.isRunning', false)
      expect(component.get('isAsyncGet'), 'isAsyncGet to be true').to.equal(true)
      expect(component.get('asyncLoading'), 'asyncLoading to be false').to.equal(false)
    })
  })

  describe('When bunsen model has endpoint', function () {
    beforeEach(function () {
      setProperties(component, {bunsenModel: {endpoint: '/foo'},
        'updateItems.isRunning': true,
        _emptyFilter: false
      })
    })

    it('should have async loading', function () {
      expect(component.get('isAsyncGet'), 'isAsyncGet to be true').to.equal(true)
      expect(component.get('asyncLoading'), 'asyncLoading to be true').to.equal(true)
    })

    it('should not be loading when task is not running', function () {
      set(component, 'updateItems.isRunning', false)
      expect(component.get('isAsyncGet'), 'isAsyncGet to be true').to.equal(true)
      expect(component.get('asyncLoading'), 'asyncLoading to be false').to.equal(false)
    })
  })
})
