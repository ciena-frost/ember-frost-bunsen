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

  describe('_findSelectedItemLabelGivenValue', function () {
    const realSpiderman = 'Miles Morales'
    const fakeSpiderman = 'Peter Parker'

    it('should give label back when value matches option', function () {
      const result =
       component._findSelectedItemLabelGivenValue(realSpiderman, [{label: 'Spiderman', value: realSpiderman}])
      expect(result).to.equal('Spiderman')
    })

    it('should give back empty string when value does not match option', function () {
      const result =
       component._findSelectedItemLabelGivenValue(fakeSpiderman, [{label: 'Spiderman', value: realSpiderman}])
      expect(result).to.equal('')
    })
  })

  describe('_findSelectedItemGivenValue', function () {
    const realSpiderman = 'Miles Morales'
    const fakeSpiderman = 'Peter Parker'

    it('should give object back when value matches option', function () {
      const result =
       component._findSelectedItemGivenValue(realSpiderman, [{label: 'Spiderman', value: realSpiderman}])
      expect(result).to.deep.equal({label: 'Spiderman', value: realSpiderman})
    })

    it('should give back undefined when value does not match option', function () {
      const result =
       component._findSelectedItemGivenValue(fakeSpiderman, [{label: 'Spiderman', value: realSpiderman}])
      expect(result).to.equal(undefined)
    })
  })

  describe('clear filter when value cleared', function () {
    beforeEach(function () {
      component.setProperties({
        filter: 'foo',
        value: 'boop',
        _isTyping: false,
        _focused: false
      })
      sinon.spy(component, 'set')
    })
    afterEach(function () {
      component.set.restore()
    })
    it('should clear filter', function () {
      component.setProperties({value: undefined})
      component.didUpdateAttrs()
      expect(component.set.calledOnce).to.equal(true)
      expect(component.set.calledWith('filter', '')).to.equal(true)
    })

    it('should not clear filter if value present', function () {
      component.didUpdateAttrs()
      expect(component.set.called).to.equal(false)
    })

    it('should not clear filter when typing', function () {
      component.setProperties({value: undefined, _isTyping: true})
      component.didUpdateAttrs()
      expect(component.set.called).to.equal(false)
    })

    it('should not clear filter when focused', function () {
      component.setProperties({value: undefined, _focused: true})
      component.didUpdateAttrs()
      expect(component.set.called).to.equal(false)
    })

    it('should not clear filter when no value or filter', function () {
      component.setProperties({value: undefined, filter: ''})
      component.didUpdateAttrs()
      expect(component.set.called).to.equal(false)
    })

    it('should not clear filter when value and filter updated', function () {
      component.setProperties({value: 'test', filter: 'test'})
      component.didUpdateAttrs()
      expect(component.set.called).to.equal(false)
    })
  })
})
