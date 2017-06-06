import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-form', function () {
  setupComponentTest('frost-bunsen-form', {
    unit: true
  })

  let component, sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenModel: {},
      bunsenView: {},
      onChange () {},
      onError () {}
    })
    component.init()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when _onVisibilityChange is called with hidden false and validateOnVisibilityChange default', function () {
    let triggerValidationSpy
    beforeEach(function () {
      triggerValidationSpy = sandbox.spy()
      component.setProperties({
        triggerValidation: triggerValidationSpy
      })
      let e = {
        target: {
          hidden: false
        }
      }
      component._onVisiblityChange(e)
    })

    it('calls triggerValidation', function () {
      expect(triggerValidationSpy.calledOnce).to.equal(true)
    })
  })

  describe('when _onVisibilityChange is called with hidden false and validateOnVisibilityChange true', function () {
    let triggerValidationSpy
    beforeEach(function () {
      triggerValidationSpy = sandbox.spy()
      component.setProperties({
        triggerValidation: triggerValidationSpy,
        validateOnVisibilityChange: true
      })
      let e = {
        target: {
          hidden: false
        }
      }
      component._onVisiblityChange(e)
    })

    it('calls triggerValidation', function () {
      expect(triggerValidationSpy.calledOnce).to.equal(true)
    })
  })

  describe('when _onVisibilityChange is called with hidden false and validateOnVisibilityChange false', function () {
    let triggerValidationSpy
    beforeEach(function () {
      triggerValidationSpy = sandbox.spy()
      component.setProperties({
        triggerValidation: triggerValidationSpy,
        validateOnVisibilityChange: false
      })
      let e = {
        target: {
          hidden: false
        }
      }
      component._onVisiblityChange(e)
    })

    it('does not call triggerValidation', function () {
      expect(triggerValidationSpy.calledOnce).to.equal(false)
    })
  })

  describe('when _onVisibilityChange is called with hidden true and validate on visibility change true', function () {
    let triggerValidationSpy
    beforeEach(function () {
      triggerValidationSpy = sandbox.spy()
      component.setProperties({
        triggerValidation: triggerValidationSpy
      })
      let e = {
        target: {
          hidden: true
        }
      }
      component._onVisiblityChange(e)
    })

    it('does not call triggerValidation', function () {
      expect(triggerValidationSpy.calledOnce).to.equal(false)
    })
  })
})
