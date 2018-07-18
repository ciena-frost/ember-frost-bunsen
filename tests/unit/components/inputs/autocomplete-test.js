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
        filter: 'foo'
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
        filter: 'foo'
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

  describe('observeSelectedItemLabelChange', function () {
    it('should set filter when not typing, item has label, and filter is empty', function () {
      component.setProperties({
        filter: '',
        options: [{label: 'Spiderman', value: 'Peter Parker'}],
        value: 'Peter Parker',
        _isTyping: false
      })
      expect(component.get('filter')).to.equal('Spiderman')
    })

    it('should not set filter when not typing, item has label, and filter is not empty', function () {
      component.setProperties({
        filter: 'foo',
        options: [{label: 'Spiderman', value: 'Peter Parker'}],
        value: 'Peter Parker',
        _isTyping: false
      })
      expect(component.get('filter')).to.equal('foo')
    })

    it('should not set filter when not typing, item has no label, and filter is empty', function () {
      component.setProperties({
        filter: '',
        options: [{value: 'Peter Parker'}],
        value: 'Peter Parker',
        _isTyping: false
      })
      expect(component.get('filter')).to.equal('')
    })

    it('should not set filter when typing, item has label, and filter is empty', function () {
      component.setProperties({
        filter: '',
        options: [{label: 'Spiderman', value: 'Peter Parker'}],
        value: 'Peter Parker',
        _isTyping: true
      })
      expect(component.get('filter')).to.equal('')
    })
  })
})
