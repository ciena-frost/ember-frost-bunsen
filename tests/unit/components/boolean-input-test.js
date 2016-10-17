import Ember from 'ember'
import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {unitTest} from 'dummy/tests/helpers/template'

describeComponent(...unitTest('frost-bunsen-input-boolean'), function () {
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
