import {expect} from 'chai'
import Ember from 'ember'
import {setupComponentTest} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import Immutable from 'seamless-immutable'

describe('Unit: frost-bunsen-input-multi-select', function () {
  setupComponentTest('frost-bunsen-input-multi-select', {
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
      registerForFormValueChanges () {},
      state: Ember.Object.create({})
    })
  })
  describe('Computed properties', function () {
    describe('mutableValue', function () {
      describe('when value is undefined', function () {
        beforeEach(function () {
          component.set('value', undefined)
        })

        it('should be undefined', function () {
          expect(component.get('mutableValue')).to.equal(undefined)
        })
      })

      describe('when value is already mutable', function () {
        let value
        beforeEach(function () {
          value = [1, 2, 3]
          component.set('value', value)
        })

        it('should return value', function () {
          expect(component.get('mutableValue')).to.eql(value)
        })
      })

      describe('when value is immutable', function () {
        let value
        beforeEach(function () {
          value = Immutable([1, 2, 3])
          component.set('value', value)
        })

        it('should return value asMutable', function () {
          expect(component.get('mutableValue')).to.eql(value.asMutable())
        })
      })
    })
  })
})
