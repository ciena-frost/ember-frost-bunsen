import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {afterEach, beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {helpers} from 'ember-frost-bunsen/components/button-group-input'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-button-group',
  'FrostBunsenInputButtonGroupComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOf([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.oneOf([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    let component, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      component = this.subject({
        bunsenId: 'foo',
        cellConfig: Ember.Object.create({
          properties: {
            model: 'foo',
            type: 'button-group'
          }
        }),
        model: {
          type: 'boolean'
        },
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({})
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('renderErrorMessage when error message present', function () {
      let errorMessage

      beforeEach(function () {
        errorMessage = 'Things are borked'
        component.set('errorMessage', errorMessage)
      })

      describe('when store.showAllErrors is true', function () {
        beforeEach(function () {
          component.set('store.showAllErrors', true)
        })

        it('returns error messages when showErrorMessage is true', function () {
          component.set('showErrorMessage', true)
          expect(component.get('renderErrorMessage')).to.eql(errorMessage)
        })

        it('returns error messages when showErrorMessage is false', function () {
          component.set('showErrorMessage', false)
          expect(component.get('renderErrorMessage')).to.eql(errorMessage)
        })
      })

      describe('when store.showAllErrors is false', function () {
        beforeEach(function () {
          component.set('store.showAllErrors', false)
        })

        it('returns error messages when showErrorMessage is true', function () {
          component.set('showErrorMessage', true)
          expect(component.get('renderErrorMessage')).to.eql(errorMessage)
        })

        it('returns null when showErrorMessage is false', function () {
          component.set('showErrorMessage', false)
          expect(component.get('renderErrorMessage')).to.be.null
        })
      })
    })

    describe('options', function () {
      let validateValuesSpy

      beforeEach(function () {
        validateValuesSpy = sandbox.stub(helpers, 'validateValues')
      })

      describe('when type is boolean', function () {
        beforeEach(function () {
          component.set('model.type', 'boolean')
        })

        it('returns expected options', function () {
          expect(component.get('options')).to.eql(['On', 'Off'])
        })
      })

      describe('when type is number', function () {
        let options, values

        beforeEach(function () {
          values = [0, 0.5, 1]
          component.set('model.enum', values)
          component.set('model.type', 'number')
          options = component.get('options')
        })

        it('validates values', function () {
          expect(validateValuesSpy.callCount).to.eql(1)
        })

        it('returns expected options', function () {
          expect(options).to.eql([0, 0.5, 1])
        })
      })

      describe('when type is string', function () {
        let options, values

        beforeEach(function () {
          values = ['one', 'two', 'three']
          component.set('model.enum', values)
          component.set('model.type', 'string')
          options = component.get('options')
        })

        it('validates values', function () {
          expect(validateValuesSpy.callCount).to.eql(1)
        })

        it('returns expected options', function () {
          expect(options).to.eql(['One', 'Two', 'Three'])
        })
      })
    })

    it('size defaults to medium', function () {
      expect(component.get('size')).to.eql('medium')
    })

    it('size can be overridden by properties.size', function () {
      component.set('cellConfig.properties', {size: 'small'})
      expect(component.get('size')).to.eql('small')
    })

    describe('.parseValue()', function () {
      describe('when type is boolean', function () {
        beforeEach(function () {
          component.set('model.type', 'boolean')
        })

        it('returns true when selected index is 0', function () {
          expect(component.parseValue(0)).to.be.true
        })

        it('returns false when selected index is 1', function () {
          expect(component.parseValue(1)).to.be.false
        })
      })

      describe('when type is number', function () {
        let values

        beforeEach(function () {
          values = [0, 0.5, 1]
          component.set('model.enum', values)
          component.set('model.type', 'number')
        })

        it('returns expected value for selected index', function () {
          values.forEach((value, index) => {
            expect(component.parseValue(index)).to.eql(value)
          })
        })
      })

      describe('when type is string', function () {
        let values

        beforeEach(function () {
          values = ['one', 'two', 'three']
          component.set('model.enum', values)
          component.set('model.type', 'string')
        })

        it('returns expected value for selected index', function () {
          values.forEach((value, index) => {
            expect(component.parseValue(index)).to.eql(value)
          })
        })
      })
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        component.set('onChange', undefined)
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          component.get('actions.onChange').call(component, 0)
        }).not.to.throw(Error)
      })
    })
  }
)
