import {expect} from 'chai'
import Ember from 'ember'
import wait from 'ember-test-helpers/wait'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const {run} = Ember

const test = unit('frost-bunsen-detail')

describe(test.label, function () {
  test.setup()

  let sandbox, component, bunsenModel, bunsenView
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    bunsenModel = {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        }
      }
    }
    bunsenView = {
      cells: [{
        model: 'foo'
      }]
    }
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('init()', function () {
    it('should initialize the renderModel to an empty model', function () {
      component = this.subject({
        bunsenModel,
        didReceiveAttrs () {}
      })

      expect(component.get('renderModel')).to.eql({
        type: 'object'
      })
    })

    it('should initialize hookPrefix to hook if hookPrefix is not defined', function () {
      component = this.subject({
        bunsenModel,
        didReceiveAttrs () {},
        hook: 'captain'
      })

      expect(component.get('hookPrefix')).to.equal('captain')
    })
  })

  describe('when initialized', function () {
    beforeEach(function () {
      component = this.subject({
        bunsenModel,
        bunsenView
      })
    })

    describe('didReceiveAttrs()', function () {
      let newModel, newView, reduxStore
      beforeEach(function () {
        newModel = {
          type: 'object',
          properties: {
            bang: {
              type: 'string'
            }
          }
        }

        newView = {
          cells: [{
            model: 'bang'
          }]
        }

        reduxStore = {
          dispatch: sandbox.stub()
        }

        component.setProperties({
          reduxStore,
          renderValue: {}
        })
      })

      it('should dispatch when model is updated', function () {
        component.set('bunsenModel', newModel)
        component.didReceiveAttrs()
        expect(reduxStore.dispatch).to.have.callCount(2)
      })

      it('should not dispatch when model is cleared', function () {
        component.set('bunsenModel', undefined)
        component.didReceiveAttrs()
        expect(reduxStore.dispatch).to.have.callCount(0)
      })

      it('should dispatch when view is updated', function () {
        component.set('bunsenView', newView)
        component.didReceiveAttrs()
        expect(reduxStore.dispatch).to.have.callCount(1)
      })

      it('should not dipatch when view is cleared', function () {
        component.set('bunsenView', undefined)
        component.didReceiveAttrs()
        expect(reduxStore.dispatch).to.have.callCount(0)
      })
    })

    describe('batchChanges()', function () {
      it('should update generic properties into batchedChanges', function () {
        run(function () {
          component.batchChanges({
            duck: 'duck'
          })
          component.batchChanges({
            duck: 'goose'
          })

          expect(component.get('batchedChanges')).to.eql({
            duck: 'goose'
          })
        })
      })

      it('should update valueChangeSet by updating the map', function () {
        run(function () {
          component.batchChanges({
            valueChangeSet: new Map([['foo', 'bar']])
          })
          component.batchChanges({
            valueChangeSet: new Map([['bar', 'baz']])
          })

          expect(Array.from(component.get('batchedChanges').valueChangeSet)).to.eql(
            [['foo', 'bar'], ['bar', 'baz']]
          )
        })
      })

      it('should clear all properties at the end of the run loop', function (done) {
        run(function () {
          component.batchChanges({
            foo: 'bar',
            valueChangeSet: new Map([['foo', 'bar']])
          })
          run.schedule('destroy', function () {
            expect(component.get('batchedChanges')).to.eql({})
            done()
          })
        })
      })
    })

    describe('storeUpdated()', function () {
      let reduxState
      beforeEach(function () {
        sandbox.stub(component, 'applyStoreUpdate')

        reduxState = {
          errors: [],
          lastAction: 'CHANGE_VALUE',
          model: {
            type: 'object'
          },
          baseModel: {
            type: 'object'
          },
          validationResult: {},
          value: {},
          valueChangeSet: new Map(),
          view: bunsenView
        }
        const reduxStore = {
          getState () {
            return reduxState
          }
        }
        component.setProperties({
          errors: reduxState.errors,
          reduxStore,
          renderModel: reduxState.model,
          value: reduxState.value,
          view: bunsenView
        })
      })

      it('should call applyStoreUpdate with new model', function () {
        const model = {
          type: 'object',
          properties: {
            foo: {
              type: 'string'
            }
          }
        }

        reduxState.model = model
        run(() => {
          component.storeUpdated()
          expect(component.applyStoreUpdate).to.be.calledWith({
            lastAction: reduxState.lastAction,
            newProps: {
              renderModel: model,
              baseModel: reduxState.baseModel
            },
            validationResult: reduxState.validationResult,
            value: reduxState.value,
            hasSchemaChanges: true
          })
        })
      })

      it('should call applyStoreUpdate with new view', function () {
        const view = {
          cells: [{
            label: 'foo',
            model: 'foo'
          }]
        }

        reduxState.view = view
        run(() => {
          component.storeUpdated()
          expect(component.applyStoreUpdate).to.be.calledWith({
            lastAction: reduxState.lastAction,
            newProps: {
              view: reduxState.view
            },
            validationResult: reduxState.validationResult,
            value: reduxState.value,
            hasSchemaChanges: true
          })
        })
      })

      it('should call applyStoreUpdate with new value and changeset', function () {
        const value = {
          foo: 'bar'
        }

        reduxState.value = value
        reduxState.valueChangeSet = new Map([['foo', 'bar']])

        run(() => {
          component.storeUpdated()
          expect(component.applyStoreUpdate.args[0][0].newProps.renderValue).to.equal(value)
          expect(Array.from(component.applyStoreUpdate.args[0][0].newProps.valueChangeSet)).to.eql([['foo', 'bar']])
        })
      })
    })

    describe('applyStoreUpdate()', function () {
      beforeEach(function () {
        sandbox.stub(component, 'validateSchemas').returns({
          validateSchemaProps: 'blah'
        })
        component.onChange = sandbox.stub()
        component.onValidation = sandbox.stub()
      })

      it('should validate schemas and update validation props when when schema has changes', function () {
        let renderModel = {
          type: 'object'
        }

        run(() => {
          component.applyStoreUpdate({
            hasSchemaChanges: true,
            newProps: {
              renderModel,
              baseModel: renderModel
            }
          })
          expect(component.validateSchemas, 'should validate the schema').to.be.calledWith(renderModel, renderModel)
          expect(component.get('validateSchemaProps'), 'should not props immediately').to.equal(undefined)
        })

        return wait(() => {
          expect(component.get('validateSchemaProps'), 'should update props after render').to.eql('blah')
        })
      })

      it('should update validate schemas when there are no schema changes', function () {
        run(() => {
          component.applyStoreUpdate({
            hasSchemaChanges: false,
            newProps: {}
          })
          expect(component.validateSchemas, 'should not validate the schema').to.have.callCount(0)
        })
      })

      describe('when newProps contains renderValue', function () {
        it('should schedule onChange after render', function () {
          run(() => {
            component.applyStoreUpdate({
              hasSchemaChanges: false,
              newProps: {
                renderValue: {foo: 'bar'}
              }
            })

            expect(component.onChange).to.have.callCount(0)
          })

          return wait(() => {
            expect(component.onChange).to.have.callCount(1)
          })
        })
      })

      describe('when lastAction is VALIDATION_RESOLVED', function () {
        it('should schedule onValidation after render', function () {
          run(() => {
            component.applyStoreUpdate({
              lastAction: 'VALIDATION_RESOLVED',
              hasSchemaChanges: false,
              newProps: {
                renderValue: {foo: 'bar'}
              }
            })

            expect(component.onValidation).to.have.callCount(0)
          })

          return wait(() => {
            expect(component.onValidation).to.have.callCount(1)
          })
        })
      })
    })
  })

  describe('precomputeIds()', function () {
    let cellConfig, component
    beforeEach(function () {
      component = this.subject({
        bunsenModel: {
          type: 'object',
          properties: {}
        }
      })

      cellConfig = {
        children: [{
          model: 'foo'
        }, {
          model: 'bar',
          arrayOptions: {
            itemCell: {
              label: 'homo array'
            }
          }
        }, {
          model: 'baz',
          arrayOptions: {
            itemCell: [{
              label: 'hetero array 1'
            }, {
              label: 'hetero array 2'
            }]
          }
        }, {
          model: 'qux',
          arrayOptions: {
            tupleCells: [{
              model: '0',
              label: 'tuple cell 2'
            }, {
              model: '1',
              label: 'tuple cell 2'
            }]
          }
        }]
      }
      component.precomputeIds(cellConfig)
    })

    it('should define __bunsenId__ property for cells', function () {
      expect(cellConfig.children[0].__bunsenId__).to.equal('root.foo')
    })

    it('should define __bunsenId__ property for arrayOptions.itemCell', function () {
      expect(cellConfig.children[1].arrayOptions.itemCell.__bunsenId__).to.equal('root.bar.[]')
    })

    it('should define __bunsenId__ property for arrayOptions.itemCell arrays', function () {
      expect(cellConfig.children[2].arrayOptions.itemCell[0].__bunsenId__).to.equal('root.baz.[]')
      expect(cellConfig.children[2].arrayOptions.itemCell[1].__bunsenId__).to.equal('root.baz.[]')
    })

    it('should define __bunsenId__ property for arrayOptions.tupleCells', function () {
      expect(cellConfig.children[3].arrayOptions.tupleCells[0].__bunsenId__).to.equal('root.qux.0')
      expect(cellConfig.children[3].arrayOptions.tupleCells[1].__bunsenId__).to.equal('root.qux.1')
    })
  })

  describe('validateSchemas', function () {
    let component, model, view
    beforeEach(function () {
      model = {
        type: 'object',
        properties: {}
      }

      view = {
        type: 'form'
        // left out version to make invalid schema
      }

      component = this.subject({
        bunsenModel: model,
        bunsenView: view
      })
    })

    it('should return empty when disableSchemaValidation is true', function () {
      component.set('disableSchemaValidation', true)
      expect(component.validateSchemas(model, model, view)).to.eql({})
    })

    it('should return error when view schema is invalid', function () {
      expect(component.validateSchemas(model, model, view).propValidationResult.errors).to.have.length(2)
    })
  })
})
