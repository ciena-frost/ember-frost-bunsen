import {describeComponent} from 'ember-mocha'
import {expect} from 'chai'
import {describe, beforeEach, it} from 'mocha'
import {unitTest} from 'dummy/tests/helpers/template'

describeComponent(...unitTest('frost-bunsen-input-select'), function () {
  const ctx = {}
  let component

  beforeEach(function () {
    component = this.subject({
      bunsenId: 'name',
      bunsenModel: {},
      bunsenView: {},
      cellConfig: {},
      onChange () {},
      registerForFormValueChanges () {},
      state: Ember.Object.create({})
    })
    ctx.component = component
  })

  describe('hasQueryChanged', function () {
    let modelQuery, component, formValue, oldFormValue

    beforeEach(function () {
      modelQuery = {
        foo: '${bar}'
      }
      formValue = {
        bar: 'baz'
      }
      oldFormValue = {
        bar: 'bar'
      }

      component = this.subject({
        initialized: true,
        bunsenId: ''
      })
    })

    describe('when query is not defined', function () {
      it('returns true when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, undefined)).to.be.equal(true)
      })

      it('returns true when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, undefined)).to.be.equal(true)
      })
    })

    describe('when not initialized', function () {
      beforeEach(() => {
        component.set('initialized', false)
      })
      it('returns true when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, undefined)).to.be.equal(true)
      })

      it('returns true when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, undefined)).to.be.equal(true)
      })
    })

    describe('when queries initialized and query is defined', function () {
      it('returns false when queries are equal', function () {
        expect(component.hasQueryChanged(oldFormValue, oldFormValue, modelQuery)).to.be.equal(false)
      })

      it('returns true when queries mismatch', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.be.equal(true)
      })
    })
  })
})
