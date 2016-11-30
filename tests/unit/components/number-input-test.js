import Ember from 'ember'
import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {unitTest} from 'dummy/tests/helpers/template'

describeComponent(...unitTest('frost-bunsen-input-number'), function () {
  const ctx = {}
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
    ctx.component = component
  })

  describe('parseValue', function () {
    [
      {in: 0, out: 0},
      {in: 0.5, out: 0.5},
      {in: 1, out: 1},
      {in: '0', out: 0},
      {in: '0.5', out: 0.5},
      {in: '1', out: 1},
      {in: '', out: null},
      {in: undefined, out: null},
      {in: null, out: null},
      {in: 'test', out: null}
    ].forEach((test) => {
      it(`expect to return ${test.out} when input is ${test.in} (${typeof test.in})`, function () {
        const result = component.parseValue(test.in)
        expect(result).to.equal(test.out)
      })
    })
  })

  describe('renderValue', function () {
    [
      {in: null, out: ''},
      {in: undefined, out: ''},
      {in: '', out: ''},
      {in: 'test', out: 'test'}
    ].forEach((test) => {
      it(`returns "${test.out}" when value is ${test.in} (${typeof test.in})`, function () {
        component.set('value', test.in)
        expect(component.get('renderValue')).to.equal(test.out)
      })
    })
  })
})
