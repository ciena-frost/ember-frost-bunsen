import {changeUtils} from 'bunsen-core'
const {getChangeSet} = changeUtils
import {expect} from 'chai'
import Ember from 'ember'
const {run} = Ember
import {setupComponentTest} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import treeUtils from 'ember-frost-bunsen/tree-utils'

function getCellConfig () {
  return {
    children: [
      {
        model: 'parent-model',
        children: [
          {
            model: 'child-model'
          }
        ]
      },
      {
        children: [
          {
            model: 'model'
          }
        ]
      },
      {
        arrayOptions: {
          itemCell: {
            children: [
              {
                model: 'array-item'
              }
            ]
          }
        },
        model: 'array-model'
      }
    ]
  }
}

describe('Unit: frost-bunsen-detail', function () {
  setupComponentTest('frost-bunsen-detail', {
    unit: true
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
      beforeEach(function (done) {
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
          value: newValue,
          valueChangeSet: getChangeSet({}, newValue),
          lastAction: 'CHANGE_VALUE'
        })

        sandbox.stub(component, 'setProperties')
        component.storeUpdated()

        run.next(() => {
          newProps = component.setProperties.lastCall.args[0]
          done()
        })
      })

      it('should update renderValue in properties', function () {
        expect(newProps.renderValue).to.eql(newValue)
      })

      it('should not update errors in properties', function () {
        expect(newProps.errors).to.equal(undefined)
      })

      it('should fire onChange', function () {
        expect(changeHandler.lastCall.args).to.eql([newValue])
      })

      it('should not fire onValidation', function () {
        expect(validationHandler).to.have.callCount(0)
      })
    })

    describe('when errors has changed but renderValue has not', function () {
      let newErrors
      beforeEach(function (done) {
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
          },
          valueChangeSet: new Map(),
          lastAction: 'VALIDATION_RESOLVED'
        })

        sandbox.stub(component, 'setProperties')
        component.storeUpdated()

        run.next(() => {
          newProps = component.setProperties.lastCall.args[0]
          done()
        })
      })

      it('should update errors in properties', function () {
        expect(newProps.errors).to.eql(newErrors)
      })

      it('should not update renderValue in properties', function () {
        expect(newProps.renderValue).to.equal(undefined)
      })

      it('should fire onValidation', function () {
        expect(validationHandler.lastCall.args).to.eql([{errors: newErrors}])
      })

      it('should not fire onChange', function () {
        expect(changeHandler.called).not.to.equal(true)
      })
    })

    describe('when both renderValue and errors have changed and lastAction is CHANGE_VALUE', function () {
      let newErrors, newValue

      beforeEach(function (done) {
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
          value: newValue,
          valueChangeSet: getChangeSet({}, newValue),
          lastAction: 'CHANGE_VALUE'
        })

        sandbox.stub(component, 'setProperties')
        component.storeUpdated()

        run.next(() => {
          newProps = component.setProperties.lastCall.args[0]
          done()
        })
      })

      it('should update renderValue in properties', function () {
        expect(newProps.renderValue).to.eql(newValue)
      })

      it('should update errors in properties', function () {
        expect(newProps.errors).to.eql(newErrors)
      })

      it('should fire onChange', function () {
        expect(changeHandler.lastCall.args).to.eql([newValue])
      })

      it('should not fire onValidation', function () {
        expect(validationHandler).to.have.callCount(0)
      })
    })

    describe('when both renderValue and errors have changed and lastAction is VALIDATION_RESOLVED', function () {
      let newErrors
      beforeEach(function (done) {
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
          },
          valueChangeSet: new Map([
            ['foo', 'bar']
          ]),
          lastAction: 'VALIDATION_RESOLVED'
        })

        sandbox.stub(component, 'setProperties')
        component.storeUpdated()

        run.next(() => {
          newProps = component.setProperties.lastCall.args[0]
          done()
        })
      })

      it('should update errors in properties', function () {
        expect(newProps.errors).to.eql(newErrors)
      })

      it('should not update renderValue in properties', function () {
        expect(newProps.renderValue).to.equal(undefined)
      })

      it('should fire onValidation', function () {
        expect(validationHandler.lastCall.args).to.eql([{errors: newErrors}])
      })

      it('should not fire onChange', function () {
        expect(changeHandler.called).not.to.equal(true)
      })
    })
  })

  describe('precomputeIds', function () {
    let cellConfig
    beforeEach(function () {
      cellConfig = getCellConfig()
      component.precomputeIds(cellConfig)
    })

    it('assigns __bunsenId__ to leaf cells', function () {
      expect(cellConfig.children[0].children[0].__bunsenId__).to.equal('root.parent-model.child-model')
      expect(cellConfig.children[1].children[0].__bunsenId__).to.equal('root.model')
    })

    it('assigns __bunsenId__ to array cells', function () {
      expect(cellConfig.children[2].__bunsenId__).to.equal('root.array-model')
    })

    it('assigns __bunsenId__ to array item cells', function () {
      const itemCell = cellConfig.children[2].arrayOptions.itemCell
      expect(itemCell.children[0].__bunsenId__).to.equal('root.array-model.[].array-item')
    })

    it('does not assign __bunsenId__ to intermediate cells', function () {
      /* eslint-disable no-unused-expressions */
      expect(cellConfig.children[0].__bunsenId__).not.to.be.defined
      /* eslint-enable no-unused-expressions */
    })
  })

  describe('precomputeDependencies', function () {
    let cellConfig
    beforeEach(function () {
      cellConfig = getCellConfig()
      component.precomputeIds(cellConfig)
      component.precomputeDependencies(cellConfig)
    })

    it('computes the lowest common ancestor for every cell', function () {
      let stack = [cellConfig]
      while (stack.length > 0) {
        let cell = stack.pop()

        if (cell.children) {
          cell.children.forEach((child) => {
            expect(treeUtils.isCommonAncestor(cell.__dependency__, child.__dependency__)).to.equal(true)
            stack.push(child)
          })
        }

        if (cell.arrayOptions && cell.arrayOptions.itemCell) {
          const itemCell = cell.arrayOptions.itemCell
          stack.push(itemCell)
          expect(
            treeUtils.isCommonAncestor(cell.__dependency__, itemCell.__dependency__)
          ).to.equal(true)
        }
      }
    })
  })

  describe('Actions', function () {
    describe('.handleTabChange()', function () {
      [0, 1, 2].forEach((index) => {
        describe(`when passed in ${index}`, function () {
          beforeEach(function () {
            component.send('handleTabChange', index)
          })

          it(`should update selectedTabIndex to ${index}`, function () {
            expect(component.get('selectedTabIndex')).to.equal(index)
          })
        })
      })
    })

    describe('.handleError()', function () {
      let errors
      beforeEach(function () {
        errors = [{
          path: 'foo.bar.baz',
          message: 'Uh oh! Something bad happend.'
        }]
      })

      describe('when an onError callback is present', function () {
        let errorCallback
        beforeEach(function () {
          errorCallback = sandbox.stub()
          component.set('onError', errorCallback)
          component.send('handleError', 'foo.bar.baz', errors)
        })

        it('should call the error callback', function () {
          expect(errorCallback.lastCall.args).to.eql(['foo.bar.baz', errors])
        })
      })

      describe('when an onError callback is missing', function () {
        beforeEach(function () {
          component.send('handleError', 'foo.bar.baz', errors)
        })

        it('should not blow up', function () {
          // If it tried to call undefined, the beforeEach would have failed
          expect(true).to.equal(true)
        })
      })
    })

    describe('.registerComponentForFormValueChanges()', function () {
      let subComponent
      beforeEach(function () {
        subComponent = {
          formValueChanged: sandbox.stub(),
          on () {}
        }
        component.set('renderValue', {foo: 'bar'})
        component.send('registerComponentForFormValueChanges', subComponent)
      })

      it('should call formValueChanged on the component being registered', function () {
        expect(subComponent.formValueChanged.lastCall.args).to.eql([{foo: 'bar'}])
      })

      it('should save the new comopnent in registeredComponents', function () {
        expect(component.get('registeredComponents')).to.contain(subComponent)
      })
    })

    describe('.registerValidator', function () {
      let subComponent, willDestroyElement
      beforeEach(function () {
        subComponent = {
          validate () {},
          formValueChanged: sandbox.stub(),
          on: sandbox.spy(function (hook, hookFn) {
            willDestroyElement = hookFn
          })
        }
        component.registerValidator(subComponent)
        sandbox.stub(component, 'unregisterValidator')
      })

      it('should add the validator to the list of input validators', function () {
        expect(component.inputValidators.length).to.equal(1)
      })

      it('should not add the validtor when the component does not define a validate method', function () {
        delete subComponent.validate
        component.inputValidators = []
        component.registerValidator(subComponent)
        expect(component.inputValidators.length).to.equal(0)
      })

      it('call .unregisterValidator() on willDestroyElement', function () {
        willDestroyElement()
        expect(component.unregisterValidator.called).to.equal(true)
      })
    })

    describe('.unregisterValidator', function () {
      let inputValidator
      beforeEach(function () {
        inputValidator = function () {}
        component.inputValidators = [inputValidator]
        component.unregisterValidator(inputValidator)
      })

      it('removes the validator reference', function () {
        expect(component.inputValidators.length).to.equal(0)
      })
    })

    // FIXME: add test for handleError action ARM IS HERE
  })
})
