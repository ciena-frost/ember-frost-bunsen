import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-array-container', function () {
  setupComponentTest('frost-bunsen-array-container', {
    unit: true
  })

  let component, sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenId: '',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      errors: {},
      onChange: function () {},
      onError: function () {}
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when addLabel() is not provided a label', function () {
    it('should return expected value', function () {
      expect(component.get('addLabel')).to.equal('Add ')
    })
  })

  describe('when addLabel() is provided a label', function () {
    beforeEach(function () {
      component.setProperties({
        cellConfig: {
          label: 'ROADM Lines'
        }
      })
    })

    it('should return expected value', function () {
      expect(component.get('addLabel')).to.equal('Add ROADM Line')
    })
  })
})
