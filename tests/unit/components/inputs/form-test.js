/* eslint-disable no-unused-expressions */
import {expect} from 'chai'
import Ember from 'ember'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import _ from 'lodash'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const {RSVP, run} = Ember

const test = unit('frost-bunsen-input-form')

describe(test.label, function () {
  test.setup()
  let sandbox, component, model, validators, plugins
  beforeEach(function () {
    sandbox = sinon.sandbox.create()

    model = {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        },
        name: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            }
          }
        }
      }
    }
    validators = ['main-validator']
    plugins = {
      foo () {
        return RSVP.resolve({
          model: 'foo-schema'
        })
      }
    }
    component = this.subject({
      bunsenId: 'name',
      bunsenModel: model.properties.name,
      bunsenView: {},
      cellConfig: {},
      getRootProps () {
        return {
          validators,
          model,
          plugins
        }
      },
      onChange () {},
      onError () {},
      registerForFormValueChanges () {},
      state: Ember.Object.create({}),
      triggerValidation () {}
    })
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('renderErrorMessage()', function () {
    it('should return the local error if present', function () {
      component.set('localError', 'busted')
      expect(component.get('renderErrorMessage')).to.equal('Form renderer error encountered: busted')
    })

    it('should return empty string when local error is not present', function () {
      expect(component.get('renderErrorMessage')).to.equal('')
    })
  })

  describe('isSchemaLoaded()', function () {
    it('should return true when model is defined and getSchemaTask is idle', function () {
      component.setProperties({
        internalBunsenModel: {},
        getSchemaTask: {
          isIdle: true
        }
      })
      expect(component.get('isSchemaLoaded')).to.equal(true)
    })

    it('should return false when model is not defined and getSchemaTask is idle', function () {
      component.setProperties({
        internalBunsenModel: undefined,
        getSchemaTask: {
          isIdle: true
        }
      })
      expect(component.get('isSchemaLoaded')).to.equal(false)
    })

    it('should return false when model is defined and getSchemaTask is not idle', function () {
      component.setProperties({
        internalBunsenModel: {},
        getSchemaTask: {
          isIdle: false
        }
      })
      expect(component.get('isSchemaLoaded')).to.equal(false)
    })

    it('should return false when model is not defined and getSchemaTask is not idle', function () {
      component.setProperties({
        internalBunsenModel: undefined,
        getSchemaTask: {
          isIdle: false
        }
      })
      expect(component.get('isSchemaLoaded')).to.equal(false)
    })
  })

  describe('internalFocusedInput()', function () {
    it('should return the local bunsen id of the focused input', function () {
      component.set('focusedInput', 'name.firstName')
      expect(component.get('internalFocusedInput')).to.equal('firstName')
    })

    it('should be undefined when there are no focused inputs', function () {
      component.set('focusedInput', undefined)
      expect(component.get('internalFocusedInput')).not.to.be.defined
    })
  })

  describe('getSchemaTask()', function () {
    let cellConfig, result, pluginResponse
    beforeEach(function () {
      cellConfig = {
        model: 'name',
        renderer: {
          name: 'form'
        }
      }
      pluginResponse = {
        model: 'foo-schema'
      }
      component.set('cellConfig', cellConfig)
      sandbox.stub(component, '_getPlugin').returns(RSVP.resolve(pluginResponse))
    })

    describe('when plugin is not defined', function () {
      beforeEach(function (done) {
        run(() => {
          component.get('getSchemaTask').perform().then((resp) => {
            result = resp
            done()
          })
        })
      })

      it('should return local schema', function () {
        expect(result.model).to.eql(model.properties.name)
      })

      it('should return all validators', function () {
        expect(result.validators).to.eql(validators)
      })

      it('should have propagateValidaton set to false', function () {
        expect(result.propagateValidation).to.equal(false)
      })
    })

    describe('when plugin is defined', function () {
      beforeEach(function () {
        cellConfig.renderer.plugin = {
          name: 'foo'
        }
      })

      describe('and args is defined', function () {
        beforeEach(function () {
          cellConfig.renderer.plugin.args = {
            foo: '${./foo}'
          }
        })

        describe('and variable substitions are expanded', function () {
          beforeEach(function (done) {
            component.set('formValue', {
              foo: 'bar'
            })

            run(() => {
              component.get('getSchemaTask').perform().then((resp) => {
                result = resp
                done()
              })
            })
          })

          it('should execute _getPlugin', function () {
            expect(component._getPlugin).to.be.calledWith(
              cellConfig.renderer.plugin,
              model.properties.name,
              validators, {
                foo: 'bar'
              })
          })

          it('should resolve with plugin response', function () {
            expect(result).to.eql(pluginResponse)
          })
        })

        describe('and variable substitions fail', function () {
          beforeEach(function (done) {
            run(() => {
              component.get('getSchemaTask').perform().then((resp) => {
                result = resp
                done()
              })
            })
          })

          it('should resolve with empty object', function () {
            expect(component._getPlugin).to.have.callCount(0)
          })
        })
      })

      describe('and args is not defined', function () {
        beforeEach(function (done) {
          run(() => {
            component.get('getSchemaTask').perform().then((resp) => {
              result = resp
              done()
            })
          })
        })

        it('should execute _getPlugin', function () {
          expect(component._getPlugin).to.be.calledWith(
            cellConfig.renderer.plugin,
            model.properties.name,
            validators, {})
        })

        it('should return plugin response', function () {
          expect(result).to.eql(pluginResponse)
        })
      })
    })

    describe('when _getPlugin rejects', function () {
      beforeEach(function () {
        cellConfig.renderer.plugin = {
          name: 'foo'
        }
      })

      it('should resolve with an error', function (done) {
        run(() => {
          component._getPlugin.returns(RSVP.reject(new Error('silly rabbit')))
          component.get('getSchemaTask').perform().catch((error) => {
            expect(error.message).to.equal('plugin (foo) failed to execute - silly rabbit')
            done()
          })
        })
      })
    })
  })

  describe('formValueChanged()', function () {
    beforeEach(function () {
      component.set('formValue', {})
      component.set('debounceTask', {
        perform (callback, interval) {
          callback()
        }
      })
      sandbox.stub(component, '_hasDependentChanges')
      sandbox.stub(component, '_updateInternalSchemas')
    })

    describe('when parent form value has changed', function () {
      let newFormValue
      beforeEach(function () {
        newFormValue = {
          foo: 'bar'
        }
      })

      it('should set the internalBunsenValue when the render value changes', function () {
        _.set(newFormValue, 'name.firstName', 'Paul')
        component.formValueChanged(newFormValue)
        expect(component.get('internalBunsenValue')).to.eql({
          firstName: 'Paul'
        })
      })

      it('should not set the internalBunsenValue when the render value does not chnage', function () {
        component.formValueChanged(newFormValue)
        expect(component.get('internalBunsenValue')).to.eql({})
      })

      it('should update internal schemas when dependent changes are detected', function () {
        component._hasDependentChanges.returns(true)
        component.formValueChanged(newFormValue)
        expect(component._updateInternalSchemas).to.have.callCount(1)
      })

      it('should not update internal schemas when dependent changes are not detected', function () {
        component._hasDependentChanges.returns(false)
        component.formValueChanged(newFormValue)
        expect(component._updateInternalSchemas).to.have.callCount(0)
      })
    })

    describe('when parent form value has not changed', function () {
      let newFormValue
      beforeEach(function () {
        newFormValue = {}
        component.formValueChanged(newFormValue)
      })

      it('should not change the internalBunsenValue', function () {
        expect(component._updateInternalSchemas).to.have.callCount(0)
      })

      it('should not change the internal schemas', function () {
        expect(component._updateInternalSchemas).to.have.callCount(0)
      })
    })
  })

  describe('validate()', function () {
    beforeEach(function () {
      component.set('validationResult', {
        errors: [{
          path: '#/firstName'
        }],
        warnings: []
      })
    })

    it('should return the internal validation results when propagateValidation is true', function () {
      component.set('propagateValidation', true)
      return component.validate().then((result) => {
        expect(result.value).to.eql({
          errors: [{
            path: '#/name/firstName'
          }],
          warnings: []
        })
      })
    })

    it('should return an empty validation result when propagateValidation is false', function () {
      component.set('propagateValidation', false)
      return component.validate().then((result) => {
        expect(result.value).to.eql({
          errors: [],
          warnings: []
        })
      })
    })
  })

  describe('_getPlugin()', function () {
    it('should reject when plugin is invalid', function () {
      return component._getPlugin({name: 'fool'}).catch((error) => {
        expect(error.message).to.equal('Could not find plugin (fool)')
      })
    })

    describe('when plugin is valid', function () {
      let result
      beforeEach(function () {
        sandbox.spy(plugins, 'foo')
        return component._getPlugin({name: 'foo'}, model.properties.name, validators).then((resp) => {
          result = resp
        })
      })

      it('should execute the given plugin', function () {
        expect(plugins.foo).to.have.callCount(1)
      })

      it('should return the plugin info with defaults', function () {
        expect(result).to.eql({
          model: 'foo-schema',
          validators,
          plugins,
          propagateValidation: true
        })
      })
    })
  })

  describe('_getLocalModel()', function () {
    it('should return the sub model referenced by the bunsenId', function () {
      expect(component._getLocalModel()).to.eql(model.properties.name)
    })

    it('should throw an error if the model is not of type object', function () {
      component.set('bunsenId', 'foo')
      expect(function () {
        component._getLocalModel()
      }).to.throw('Model referenced must be of type object to use the form renderer')
    })
  })

  describe('_updateInternalSchemas()', function () {
    beforeEach(function () {
      component.setProperties({
        getSchemaTask: {
          perform: sandbox.stub()
        },
        internalBunsenModel: 'old',
        internalBunsenView: 'old'
      })
    })

    describe('when getSchemaTask resolves with a different model', function () {
      beforeEach(function () {
        component.get('getSchemaTask').perform.returns(RSVP.resolve({
          model: 'new'
        }))
        return component._updateInternalSchemas()
      })

      it('should set internalBunsenModel', function () {
        expect(component.get('internalBunsenModel')).to.equal('new')
      })

      it('should not set internalBunsenView', function () {
        expect(component.get('internalBunsenView')).to.equal('old')
      })
    })

    describe('when getSchemaTask resolves with the same model', function () {
      beforeEach(function () {
        component.get('getSchemaTask').perform.returns(RSVP.resolve({
          model: 'old'
        }))
        return component._updateInternalSchemas()
      })

      it('should not set internalBunsenModel', function () {
        expect(component.get('internalBunsenModel')).to.equal('old')
      })

      it('should not set internalBunsenView', function () {
        expect(component.get('internalBunsenView')).to.equal('old')
      })
    })

    describe('when getSchemaTask resolves with a different view', function () {
      beforeEach(function () {
        component.get('getSchemaTask').perform.returns(RSVP.resolve({
          view: 'new'
        }))
        return component._updateInternalSchemas()
      })

      it('should not set internalBunsenModel', function () {
        expect(component.get('internalBunsenModel')).to.equal('old')
      })

      it('should set internalBunsenView', function () {
        expect(component.get('internalBunsenView')).to.equal('new')
      })
    })

    describe('when getSchemaTask resolves with the same view', function () {
      beforeEach(function () {
        component.get('getSchemaTask').perform.returns(RSVP.resolve({
          view: 'old'
        }))
        return component._updateInternalSchemas()
      })

      it('should not set internalBunsenModel', function () {
        expect(component.get('internalBunsenModel')).to.equal('old')
      })

      it('should not set internalBunsenView', function () {
        expect(component.get('internalBunsenView')).to.equal('old')
      })
    })
  })

  describe('_hasDependentChanges()', function () {
    let cellConfig
    beforeEach(function () {
      cellConfig = {
        model: 'name',
        renderer: {
          name: 'form'
        }
      }
      component.set('cellConfig', cellConfig)
    })

    describe('when plugin.args is defined', function () {
      beforeEach(function () {
        cellConfig.renderer.plugin = {
          args: {
            foo: '${./foo}'
          }
        }
      })

      it('should return true when dependent changes occur', function () {
        expect(component._hasDependentChanges({}, {foo: 'bar'})).to.equal(true)
      })

      it('should return false when non-dependent changes occur', function () {
        expect(component._hasDependentChanges({}, {name: {}})).to.equal(false)
      })
    })

    describe('when plugin.args is not defined', function () {
      it('should return when any changes occur', function () {
        expect(component._hasDependentChanges({}, {foo: 'bar'})).to.equal(false)
      })
    })
  })

  describe('_getVariables()', function () {
    it('should return all variables referenced', function () {
      expect(component._getVariables({
        foo: '${foo}',
        bar: '${bar}'
      })).to.eql(['foo', 'bar'])
    })
  })

  describe('actions: formValidation', function () {
    beforeEach(function () {
      sandbox.stub(component, 'triggerValidation')
      component.set('internalBunsenValue', {
        firstName: 'Paul',
        lastName: 'Ryan'
      })
      component.send('formValidation', 'validationResult')
    })

    it('should set validationResult', function () {
      expect(component.get('validationResult')).to.equal('validationResult')
    })

    it('should call triggerValidation', function () {
      expect(component.triggerValidation).to.have.callCount(1)
    })
  })
})
