import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, afterEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import sinon from 'sinon'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-detail',
  'Unit : Unit: Component | frost-bunsen-detail',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      bunsenModel: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      bunsenView: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      hook: PropTypes.string,
      registeredComponents: PropTypes.array,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      value: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ])
    })

    let component, bunsenModel, value, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      bunsenModel = {
        properties: {
          bar: {type: 'string'},
          baz: {type: 'number'},
          foo: {type: 'string'}
        },
        required: ['foo'],
        type: 'object'
      }

      value = {
        bar: 'bar',
        baz: null
      }

      component = this.subject({
        bunsenModel,
        value
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('actions.onTabChange() updates selectedTabIndex', function () {
      [0, 1, 2].forEach((index) => {
        component.actions.onTabChange.call(component, index)
        expect(component.get('selectedTabIndex')).to.eql(index)
      })
    })

    it('initializes the store with an initial value on init', function () {
      const expectedValue = {
        bar: 'bar'
      }
      const state = component.get('reduxStore').getState()

      expect(state.value).to.eql(expectedValue)
    })

    describe('.storeUpdated()', function () {
      let changeHandler, validationHandler, reduxStore, newProps

      beforeEach(function () {
        reduxStore = {
          getState: sandbox.stub()
        }
        changeHandler = sandbox.stub()
        validationHandler = sandbox.stub()

        component.setProperties({
          errors: [],
          onChange: changeHandler,
          onValidation: validationHandler,
          reduxModel: {
            fizz: 'bang'
          },
          reduxStore,
          renderValue: {
            foo: 'bar'
          }
        })
      })

      describe('when renderValue has changed but errors has not', function () {
        let newValue
        beforeEach(function () {
          newValue = {
            foo: 'baz'
          }

          reduxStore.getState.returns({
            errors: [],
            validationResult: {
              errors: []
            },
            model: {
              fizz: 'bang'
            },
            value: newValue
          })

          sandbox.stub(component, 'setProperties')
          component.storeUpdated()
          newProps = component.setProperties.lastCall.args[0]
        })

        it('should update renderValue in properties', function () {
          expect(newProps.renderValue).to.be.eql(newValue)
        })

        it('should not update errors in properties', function () {
          expect(newProps.errors).not.to.be.defined
        })

        it('should fire onChange', function () {
          expect(changeHandler.lastCall.args).to.be.eql([newValue])
        })

        it('should fire onValidation', function () {
          expect(validationHandler.lastCall.args).to.be.eql([{errors: []}])
        })
      })

      describe('when errors has changed but renderValue has not', function () {
        let newErrors
        beforeEach(function () {
          newErrors = [
            {
              path: '#/fizz',
              message: 'Missing required property fizz'
            }
          ]

          reduxStore.getState.returns({
            errors: newErrors,
            validationResult: {
              errors: newErrors
            },
            model: {
              fizz: 'bang'
            },
            value: {
              foo: 'bar'
            }
          })

          sandbox.stub(component, 'setProperties')
          component.storeUpdated()
          newProps = component.setProperties.lastCall.args[0]
        })

        it('should update errors in properties', function () {
          expect(newProps.errors).to.be.eql(newErrors)
        })

        it('should not update renderValue in properties', function () {
          expect(newProps.renderValue).not.to.be.defined
        })

        it('should fire onValidation', function () {
          expect(validationHandler.lastCall.args).to.be.eql([{errors: newErrors}])
        })

        it('should not fire onChange', function () {
          expect(changeHandler.called).not.to.be.ok
        })
      })

      describe('when both renderValue and errors have changed', function () {
        let newErrors, newValue

        beforeEach(function () {
          newErrors = [
            {
              path: '#/fizz',
              message: 'Missing required property fizz'
            }
          ]

          newValue = {
            foo: 'baz'
          }

          reduxStore.getState.returns({
            errors: newErrors,
            validationResult: {
              errors: newErrors
            },
            model: {
              fizz: 'bang'
            },
            value: newValue
          })

          sandbox.stub(component, 'setProperties')
          component.storeUpdated()
          newProps = component.setProperties.lastCall.args[0]
        })

        it('should update renderValue in properties', function () {
          expect(newProps.renderValue).to.be.eql(newValue)
        })

        it('should update errors in properties', function () {
          expect(newProps.errors).to.be.eql(newErrors)
        })

        it('should fire onChange', function () {
          expect(changeHandler.lastCall.args).to.be.eql([newValue])
        })

        it('should fire onValidation', function () {
          expect(validationHandler.lastCall.args).to.be.eql([{errors: newErrors}])
        })
      })
    })
  }
)
