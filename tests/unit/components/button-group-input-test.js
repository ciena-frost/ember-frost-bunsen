import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {afterEach, beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {helpers} from 'ember-frost-bunsen/components/button-group-input'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {disabledTests, renderErrorMessageTests} from 'dummy/tests/helpers/abstract-input'

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
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({
          model: 'foo',
          renderer: {
            name: 'button-group'
          }
        }),
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
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    disabledTests(ctx)
    renderErrorMessageTests(ctx)

    describe('options', function () {
      let validateValuesSpy

      beforeEach(function () {
        validateValuesSpy = sandbox.stub(helpers, 'validateValues')
      })

      describe('when type is boolean', function () {
        beforeEach(function () {
          component.set('bunsenModel.type', 'boolean')
        })

        it('returns expected options', function () {
          expect(component.get('options')).to.eql(['On', 'Off'])
        })
      })

      describe('when type is number', function () {
        let options, values

        beforeEach(function () {
          values = [0, 0.5, 1]
          component.set('bunsenModel.enum', values)
          component.set('bunsenModel.type', 'number')
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
          component.set('bunsenModel.enum', values)
          component.set('bunsenModel.type', 'string')
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
