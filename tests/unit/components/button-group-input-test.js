import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {afterEach, beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-button-group',
  'Unit: Component | frost-bunsen-input-button-group',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      component = this.subject({
        bunsenId: 'foo',
        bunsenModel: {
          type: 'boolean'
        },
        bunsenView: {},
        cellConfig: {
          model: 'foo',
          renderer: {
            name: 'button-group'
          }
        },
        onChange () {},
        state: Ember.Object.create({})
      })
      ctx.component = component
    })

    afterEach(function () {
      sandbox.restore()
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      formDisabled: PropTypes.bool,
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      registerForFormValueChanges: PropTypes.func,
      required: PropTypes.bool,
      showAllErrors: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    it('size defaults to medium', function () {
      expect(component.get('size')).to.eql('medium')
    })

    it('size can be overridden by renderer.size', function () {
      component.set('cellConfig.renderer.size', 'small')
      expect(component.get('size')).to.eql('small')
    })

    describe('.parseValue()', function () {
      describe('when type is boolean', function () {
        beforeEach(function () {
          component.set('bunsenModel.type', 'boolean')
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
          component.set('bunsenModel.enum', values)
          component.set('bunsenModel.type', 'number')
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
          component.set('bunsenModel.enum', values)
          component.set('bunsenModel.type', 'string')
        })

        it('returns expected value for selected index', function () {
          values.forEach((value, index) => {
            expect(component.parseValue(index)).to.eql(value)
          })
        })
      })
    })
  }
)
