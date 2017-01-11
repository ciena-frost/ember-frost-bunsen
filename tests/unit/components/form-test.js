import {expect} from 'chai'
import Ember from 'ember'
const {RSVP} = Ember
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-form', function () {
  setupComponentTest('frost-bunsen-form', {
    unit: true
  })

  let component, onChangeSpy, onValidationSpy, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    onChangeSpy = sandbox.spy()
    onValidationSpy = sandbox.spy()
    component = this.subject({
      bunsenModel: {
        properties: {
          bar: {type: 'string'},
          baz: {type: 'number'},
          foo: {type: 'string'}
        },
        required: ['foo'],
        type: 'object'
      },
      onChange: onChangeSpy,
      onValidation: onValidationSpy
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('actions.handleTabChange() updates selectedTabIndex', function () {
    [0, 1, 2].forEach((index) => {
      component.send('handleTabChange', index)
      expect(component.get('selectedTabIndex')).to.eql(index)
    })
  })

  describe('update bar', function () {
    let updatedValue

    beforeEach(function () {
      const onChangeDeferred = RSVP.defer()

      component.setProperties({
        onChange (value) {
          updatedValue = value
          onChangeDeferred.resolve()
        }
      })

      component.send('handleChange', 'bar', 'test')
      return onChangeDeferred.promise
    })

    it('should update renderValue', function () {
      const renderValue = component.get('renderValue')
      expect(renderValue).to.eql({
        bar: 'test'
      })
    })

    it('should call onChange with the expected value', function () {
      expect(updatedValue).to.eql({
        bar: 'test'
      })
    })
  })

  describe('update baz', function () {
    let updatedValue

    beforeEach(function () {
      const onChangeDeferred = RSVP.defer()

      component.setProperties({
        onChange (value) {
          updatedValue = value
          onChangeDeferred.resolve()
        }
      })

      component.send('handleChange', 'baz', 42)
      return onChangeDeferred.promise
    })

    it('should update renderValue', function () {
      const renderValue = component.get('renderValue')
      expect(renderValue).to.eql({
        baz: 42
      })
    })

    it('should call onChange with the expected value', function () {
      expect(updatedValue).to.eql({
        baz: 42
      })
    })
  })

  describe('update foo', function () {
    let updatedValue, validationResult

    beforeEach(function () {
      const onChangeDeferred = RSVP.defer()
      const onValidationDeferred = RSVP.defer()

      component.setProperties({
        onChange (value) {
          updatedValue = value
          onChangeDeferred.resolve()
        },
        onValidation (result) {
          validationResult = result
          onValidationDeferred.resolve()
        }
      })

      component.send('handleChange', 'foo', 'test')
      return RSVP.all([
        onChangeDeferred.promise,
        onValidationDeferred.promise
      ])
    })

    it('should update renderValue', function () {
      const renderValue = component.get('renderValue')
      expect(renderValue).to.eql({
        foo: 'test'
      })
    })

    it('should call onChange with the expected value', function () {
      expect(updatedValue).to.eql({
        foo: 'test'
      })
    })

    it('should call onValidation with expected validation errors', function () {
      expect(validationResult.errors).to.eql([])
    })

    it('should call onValidation with expected validation warnings', function () {
      expect(validationResult.warnings).to.eql([])
    })
  })
})
