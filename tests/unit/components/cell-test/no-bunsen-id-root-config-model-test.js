import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {builtInRenderers} from 'bunsen-core/validator'

describeComponent(
  'frost-bunsen-cell',
  'Unit: Component | frost-bunsen-cell with no bunsenId and root config model',
  {
    unit: true
  },
  function () {
    let component, onChangeSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      onChangeSpy = sandbox.spy()

      component = this.subject({
        bunsenId: '',
        bunsenModel: {
          properties: {
            foo: {type: 'string'}
          },
          type: 'object'
        },
        bunsenStore: Ember.Object.create({
          formValue: {},
          renderers: builtInRenderers,
          view: {}
        }),
        cellConfig: Ember.Object.create({
          model: 'foo'
        }),
        errors: {},
        onChange: onChangeSpy,
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
      const error = 'what is foo without a little bar'
      component.set('errors', {'foo': [error]})
      expect(component.get('errorMessage').toString()).to.eql(error)
    })

    it('errorMessage returns multiple errors', function () {
      const error1 = 'what is foo without a little bar'
      const error2 = 'foo is feeling lonely'
      component.set('errors', {'foo': [error1, error2]})
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
      expect(component.get('nonIndexId')).to.equal('foo')
    })

    it('readOnly defaults to false', function () {
      expect(component.get('readOnly')).to.be.false
    })

    it('renderId returns ${bunsenId}.${model}', function () {
      expect(component.get('renderId')).to.equal('foo')
    })

    it('subModel returns expected value', function () {
      expect(component.get('subModel')).to.eql({type: 'string'})
    })

    describe('when value is present', function () {
      beforeEach(function () {
        component.set('value', {
          foo: {
            bar: 'baz'
          }
        })
      })

      it('renderValue returns value for config model', function () {
        expect(component.get('renderValue')).to.eql({
          bar: 'baz'
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
