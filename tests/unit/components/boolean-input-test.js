import {expect} from 'chai'
import Ember from 'ember'
import {setupComponentTest} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'

describe('Unit: frost-bunsen-input-boolean', function () {
  setupComponentTest('frost-bunsen-input-boolean', {
    unit: true
  })

  const ctx = {}
  let component

  beforeEach(function () {
    component = this.subject({
      bunsenId: 'enabled',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      onChange () {},
      onError () {},
      state: Ember.Object.create({value: true})
    })
    ctx.component = component
  })

  describe('checked', function () {
    [
      {in: null, out: false},
      {in: undefined, out: false},
      {in: false, out: false},
      {in: true, out: true},
      {in: 'false', out: false},
      {in: 'true', out: true},
      {in: 'False', out: false},
      {in: 'True', out: true},
      {in: 'FALSE', out: false},
      {in: 'TRUE', out: true}
    ].forEach((test) => {
      it(`returns ${test.out} when value is ${test.in} (${typeof test.in})`, function () {
        component.set('value', test.in)
        expect(component.get('checked')).to.equal(test.out)
      })
    })
  })
})
