import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

describe('Unit: frost-bunsen-cell', function () {
  setupComponentTest('frost-bunsen-cell', {
    unit: true
  })

  let component, sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    component = this.subject({
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      errors: {},
      onChange: sandbox.spy(),
      onError: sandbox.spy()
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('showSection()', function () {
    it('returns true when model is array and no renderer is provided', function () {
      component.setProperties({
        bunsenModel: {
          type: 'array'
        }
      })
      expect(component.get('showSection')).to.equal(true)
    })

    it('returns false when model is array and renderer is provided', function () {
      component.setProperties({
        bunsenModel: {
          type: 'array'
        },
        cellConfig: {
          renderer: {}
        }
      })
      expect(component.get('showSection')).to.equal(false)
    })
  })
})
