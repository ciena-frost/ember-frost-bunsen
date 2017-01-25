import {expect} from 'chai'
import Ember from 'ember'
import {setupComponentTest} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'

describe('Unit: frost-bunsen-input-select', function () {
  setupComponentTest('frost-bunsen-input-select', {
    unit: true
  })

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
        expect(component.hasQueryChanged(formValue, formValue, undefined)).to.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, undefined)).to.equal(false)
      })
    })

    describe('when query has no dependencies', function () {
      it('returns false when queries are the same', function () {
        expect(component.hasQueryChanged(formValue, formValue, {name: '$filter'})).to.equal(false)
      })

      it('returns false when queries are not the same', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, {name: '$filter'})).to.equal(false)
      })
    })

    describe('when queries have dependencies', function () {
      it('returns false when queries are equal', function () {
        expect(component.hasQueryChanged(oldFormValue, oldFormValue, modelQuery)).to.equal(false)
      })

      it('returns true when queries mismatch', function () {
        expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
      })
    })

    describe('when queries have dependencies but either one is missing', function () {
      describe('when oldFormValue is missing dependencies', function () {
        beforeEach(function () {
          delete oldFormValue.bar
        })

        it('returns false when formValue is also missing dependencies', function () {
          delete formValue.bar
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(false)
        })
        it('returns true when formValue is not missing dependencies', function () {
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
        })
      })

      describe('when formValue is missing dependencies', function () {
        beforeEach(function () {
          delete formValue.bar
        })

        it('returns false when oldFormValue is also missing dependencies', function () {
          delete oldFormValue.bar
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(false)
        })

        it('returns true when oldFormValue is not missing dependencies', function () {
          expect(component.hasQueryChanged(oldFormValue, formValue, modelQuery)).to.equal(true)
        })
      })
    })
  })

  describe('needsInitialItems', function () {
    describe('when options is not initialized', function () {
      beforeEach(function () {
        component.set('itemsInitialized', false)
      })

      it('returns true when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialItems()).to.equal(true)
      })

      it('returns true when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialItems()).to.equal(true)
      })

      it('returns true when list data is provided', function () {
        component.set('cellConfig', {
          renderer: {
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }]
            }
          }
        })

        expect(component.needsInitialItems()).to.equal(true)
      })
    })

    describe('when options is initialized', function () {
      beforeEach(function () {
        component.set('itemsInitialized', true)
      })

      it('returns false when query does not contain dependencies', function () {
        component.set('bunsenModel', {
          query: {
          }
        })
        expect(component.needsInitialItems()).to.equal(false)
      })

      it('returns false when enum is specified', function () {
        component.set('bunsenModel', {
          enum: []
        })
        expect(component.needsInitialItems()).to.equal(false)
      })

      it('returns false when list data is provided', function () {
        component.set('cellConfig', {
          renderer: {
            options: {
              data: [{
                label: 'Custom',
                value: 'Custom'
              }]
            }
          }
        })

        expect(component.needsInitialItems()).to.equal(false)
      })
    })
  })

  describe('listData', function () {
    let cellConfig, bunsenModel
    beforeEach(function () {
      bunsenModel = {
        enum: ['enum_value']
      }

      cellConfig = {
        renderer: {
          options: {
            data: [{
              label: 'Custom',
              value: 'custom'
            }],
            none: {
              label: 'None',
              present: false,
              value: ''
            }
          }
        }
      }
    })
    it('returns enums when custom data is not present', function () {
      component.setProperties({
        bunsenModel
      })

      expect(component.get('listData')).to.eql([
        {
          label: 'enum_value',
          value: 'enum_value'
        }
      ])
    })

    it('returns the only custom data when it is present and enums is present', function () {
      component.setProperties({
        bunsenModel,
        cellConfig
      })

      expect(component.get('listData')).to.eql([
        {
          label: 'Custom',
          value: 'custom'
        }
      ])
    })

    it('returns custom data when it is present', function () {
      component.setProperties({
        cellConfig
      })

      expect(component.get('listData')).to.eql([
        {
          label: 'Custom',
          value: 'custom'
        }
      ])
    })

    it('returns an empty list when enum and custom data is not present', function () {
      expect(component.get('listData')).to.eql([])
    })

    it('prepends the enums with the `none` option when present', function () {
      cellConfig.renderer.options.none.present = true
      delete cellConfig.renderer.options.data
      component.setProperties({
        bunsenModel,
        cellConfig
      })
      expect(component.get('listData')).to.eql([
        {
          label: 'None',
          value: ''
        },
        {
          label: 'enum_value',
          value: 'enum_value'
        }
      ])
    })

    it('prepends the custom data with the `none` option when present', function () {
      cellConfig.renderer.options.none.present = true
      component.setProperties({
        cellConfig
      })
      expect(component.get('listData')).to.eql([
        {
          label: 'None',
          value: ''
        },
        {
          label: 'Custom',
          value: 'custom'
        }
      ])
    })

    it('only returns the `none` options when no enum and no custom data is present', function () {
      cellConfig.renderer.options.none.present = true
      delete cellConfig.renderer.options.data
      component.setProperties({
        cellConfig
      })
      expect(component.get('listData')).to.eql([
        {
          label: 'None',
          value: ''
        }
      ])
    })

    it('defaults none.label and none.value', function () {
      cellConfig.renderer.options.none = {
        present: true
      }
      delete cellConfig.renderer.options.data
      component.setProperties({
        cellConfig
      })
      expect(component.get('listData')).to.eql([
        {
          label: 'None',
          value: ''
        }
      ])
    })
  })
})
