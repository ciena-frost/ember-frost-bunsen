import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {builtInRenderers} from 'ember-frost-bunsen/validator/index'

describeComponent(
  'frost-bunsen-cell',
  'FrostBunsenCellComponent with bunsenId and nested config model',
  {},
  function () {
    let component, onChangeSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()

      component = this.subject({
        bunsenId: 'foo',
        config: {
          model: 'bar.baz'
        },
        errors: {},
        model: {
          properties: {
            foo: {
              properties: {
                bar: {
                  propeties: {
                    baz: {type: 'string'}
                  },
                  type: 'object'
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

    it('errorMessage returns null when no erorrs', function () {
      component.set('errors', {})
      expect(component.get('errorMessage')).to.be.null
    })

    it('errorMessage returns signle error', function () {
      const error = 'baz is invalid'
      component.set('errors', {'foo.bar.baz': [error]})
      expect(component.get('errorMessage').toString()).to.eql(error)
    })

    it('errorMessage returns multiple errors', function () {
      const error1 = 'baz is invalid'
      const error2 = 'bar is feeling lonely'
      component.set('errors', {'foo.bar.baz': [error1, error2]})
      expect(component.get('errorMessage').toString()).to.eql(`${error1}<br>${error2}`)
    })

    it('isArrayItem() returns false', function () {
      expect(component.get('isArrayItem')).to.be.false
    })

    it('isSubModelArray returns false', function () {
      expect(component.get('isSubModelArray')).to.be.false
    })

    it('isSubModelObject returns false', function () {
      expect(component.get('isSubModelObject')).to.be.false
    })

    it('nonIndexId returns expected value', function () {
      expect(component.get('nonIndexId')).to.equal('foo.bar.baz')
    })

    it('readOnly defaults to false', function () {
      expect(component.get('readOnly')).to.be.false
    })

    it('renderId returns ${bunsenId}.${model}', function () {
      expect(component.get('renderId')).to.equal('foo.bar.baz')
    })

    it('subModel returns expected value', function () {
      expect(component.get('subModel')).to.eql({type: 'string'})
    })

    describe('when value is present', function () {
      beforeEach(function () {
        component.set('value', {
          foo: {
            bar: {
              baz: 'spam'
            }
          }
        })
      })

      it('renderValue returns value for config model', function () {
        expect(component.get('renderValue')).to.equal('spam')
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
