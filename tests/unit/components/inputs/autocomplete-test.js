import {expect} from 'chai'
import Ember from 'ember'
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
})
