import Ember from 'ember'
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

    describe('when query is undefined', function () {
      it('returns false when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, undefined)).to.be.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, undefined)).to.be.equal(false)
      })
    })

    describe('when query has no dependencies', function () {
      it('returns false when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, {name: '$filter'})).to.be.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, {name: '$filter'})).to.be.equal(false)
      })
    })

    describe('when queries has dependencies', function () {
      it('returns false when queries are equal', function () {
        expect(component.hasQueryChanged(oldFormValue, oldFormValue, modelQuery)).to.be.equal(false)
      })

      it('returns true when queries mismatch', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.be.equal(true)
      })
    })
  })

  describe('needsInitialOptions', function () {
    describe('when options is not initialized', function () {
      beforeEach(function () {
        component.set('optionsInitialized', false)
      })

      it('returns true when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialOptions()).to.equal(true)
      })

      it('returns true when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialOptions()).to.equal(true)
      })
    })

    describe('when options is initialized', function () {
      beforeEach(function () {
        component.set('optionsInitialized', true)
      })

      it('returns false when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialOptions()).to.equal(false)
      })

      it('returns false when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialOptions()).to.equal(false)
      })
    })
  })
})
