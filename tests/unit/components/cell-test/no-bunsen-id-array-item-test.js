import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {builtInRenderers} from 'ember-frost-bunsen/validator/index'

describeComponent(
  'frost-bunsen-cell',
  'FrostBunsenCellComponent when array item without bunsenId',
  {},
  function () {
    let component, onChangeSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()

      component = this.subject({
        bunsenId: '',
        config: {
          model: 'foo.bar.0'
        },
        errors: {},
        model: {
          properties: {
            foo: {
              properties: {
                bar: {
                  items: {
                    properties: {
                      baz: {type: 'string'}
                    },
                    type: 'object'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            }
          },
          type: 'object'
        },
        onChange: onChangeSpy,
        store: Ember.Object.create({
          formValue: {},
          renderers: builtInRenderers,
          view: {}
        }),
        value: {}
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('index returns expected value', function () {
      expect(component.get('index')).to.equal(0)
    })

    it('isArrayItem() returns true', function () {
      expect(component.get('isArrayItem')).to.be.true
    })

    it('isSubModelArray returns true', function () {
      expect(component.get('isSubModelArray')).to.be.true
    })

    it('isSubModelObject returns false', function () {
      expect(component.get('isSubModelObject')).to.be.false
    })

    it('nonIndexId returns expected value', function () {
      expect(component.get('nonIndexId')).to.equal('foo.bar')
    })

    it('readOnly defaults to false', function () {
      expect(component.get('readOnly')).to.be.false
    })

    it('renderId returns ${bunsenId}.${model}', function () {
      expect(component.get('renderId')).to.equal('foo.bar.0')
    })

    it('subModel returns expected value', function () {
      expect(component.get('subModel')).to.eql({
        items: {
          properties: {
            baz: {type: 'string'}
          },
          type: 'object'
        },
        type: 'array'
      })
    })

    describe('when value is present', function () {
      beforeEach(function () {
        component.set('value', {
          foo: {
            bar: [
              {baz: 'spam'}
            ]
          }
        })
      })

      it('renderValue returns value for config model', function () {
        expect(component.get('renderValue')).to.eql({
          baz: 'spam'
        })
      })
    })

    describe('when value is not present', function () {
      beforeEach(function () {
        component.set('value', null)
      })

      it('renderValue returns undefined', function () {
        expect(component.get('renderValue')).to.be.undefined
      })
    })
  }
)
