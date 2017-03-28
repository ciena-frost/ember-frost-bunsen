import {expect} from 'chai'
import Ember from 'ember'
const {isEmpty, run} = Ember
import {DATE_VALUE} from 'ember-frost-bunsen/components/inputs/when'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import moment from 'moment'
import sinon from 'sinon'

describe.only('Unit: frost-bunsen-input-when', function () {
  setupComponentTest('frost-bunsen-input-when', {
    unit: true
  })
  const ctx = {}
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
        model: 'foo',
        renderer: {
          name: 'when'
        }
      },
      onChange () {},
      onError () {},
      state: Ember.Object.create({})
    })
    ctx.component = component
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('size defaults to "small"', function () {
    expect(component.get('size')).to.eql('small')
  })

  it('dateFormat defaults to "YYYY-MM-DD"', function () {
    expect(component.get('dateFormat')).to.eql('YYYY-MM-DD')
  })

  it('timeFormat defaults to "HH:mm:ss"', function () {
    expect(component.get('timeFormat')).to.eql('HH:mm:ss')
  })

  it('dateTimeFormat defaults to "YYYY-MM-DDTHH:mm:ssZ"', function () {
    expect(component.get('dateTimeFormat')).to.eql('YYYY-MM-DDTHH:mm:ssZ')
  })

  describe('when init() is called', function () {
    let firstButtonValue = 'RIGHT_NOW'
    let onChangeSpy
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      component.setProperties({
        'cellConfig.renderer.value': firstButtonValue,
        onChange: onChangeSpy
      })
      component.init()
    })

    it('sets date', function () {
      expect(isEmpty(component.get('date'))).to.equal(false)
    })

    it('sets time', function () {
      expect(isEmpty(component.get('time'))).to.equal(false)
    })

    it('sets firstButtonValue', function () {
      expect(component.get('firstButtonValue')).to.equal(firstButtonValue)
    })

    it('sets selectedValue to value of first button', function () {
      expect(component.get('selectedValue')).to.equal(firstButtonValue)
    })

    it('sets storedDateTimeValue', function () {
      expect(isEmpty(component.get('storedDateTimeValue'))).to.equal(false)
    })

    it('calls onChange() with value of first button', function () {
      run.later(() => expect(onChangeSpy).to.have.been.calledWith('foo', firstButtonValue))
    })
  })

  describe('when selectDate() is called', function () {
    let onChangeSpy
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      component.set('onChange', onChangeSpy)
      component.send('selectDate', moment('2017-02-25T00:00:00-06:00'))
    })

    it('sets "storedDateTimeValue" for the second radio button', function () {
      expect(component.get('storedDateTimeValue')).to.equal('2017-02-25T00:00:00-06:00')
    })

    it('calls onChange() with correct argument', function () {
      expect(onChangeSpy).to.have.been.calledWith('foo', '2017-02-25T00:00:00-06:00')
    })
  })

  describe('when selectedButton() is called', function () {
    let eventObject = {target: {value: null}}
    let firstButtonValue = 'RIGHT_NOW'
    let onChangeSpy
    let setDisabled
    beforeEach(function () {
      onChangeSpy = sandbox.spy()
      setDisabled = sandbox.stub()
      component.setProperties({
        firstButtonValue: firstButtonValue,
        onChange: onChangeSpy,
        _setDisabled: setDisabled,
        storedDateTimeValue: 'Test'
      })
    })

    describe('when secenario for first button has been selected', function () {
      beforeEach(function () {
        eventObject.target.value = firstButtonValue
        component.send('selectedButton', eventObject)
      })

      it('sets "selectedValue" to the value the first radio button', function () {
        expect(component.get('selectedValue')).to.equal(firstButtonValue)
      })

      it('calls onChange() with correct argument (value from firstButtonValue)', function () {
        expect(onChangeSpy).to.have.been.calledWith('foo', firstButtonValue)
      })

      it('calls _setDisabled() should be called with true', function () {
        expect(setDisabled).to.have.been.calledWith(true)
      })
    })

    describe('when secenario for second button has been selected', function () {
      beforeEach(function () {
        eventObject.target.value = DATE_VALUE
        component.send('selectedButton', eventObject)
      })

      it('sets "selectedValue" to the value the second radio button', function () {
        expect(component.get('selectedValue')).to.equal(DATE_VALUE)
      })

      it('calls onChange() with correct argument (value from storedDateTimeValue)', function () {
        expect(onChangeSpy).to.have.been.calledWith('foo', 'Test')
      })

      it('calls _setDisabled() should be called with false', function () {
        expect(setDisabled).to.have.been.calledWith(false)
      })
    })
  })
})
