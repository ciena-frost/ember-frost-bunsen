import Ember from 'ember'
import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'

describe('Unit: frost-bunsen-input-static', function () {
  setupComponentTest('frost-bunsen-input-static', {
    unit: true
  })

  let component

  beforeEach(function () {
    component = this.subject({
      bunsenId: 'name',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      onChange () {},
      onError () {},
      state: Ember.Object.create({})
    })
  })

  describe('renderValue', function () {
    [
      {in: null, out: '—'},
      {in: undefined, out: '—'},
      {in: '', out: '—'},
      {in: 'test', out: 'test'}
    ].forEach((test) => {
      it(`returns "${test.out}" when value is ${test.in} (${typeof test.in})`, function () {
        component.set('value', test.in)
        expect(component.get('renderValue')).to.equal(test.out)
      })
    })
  })
})
