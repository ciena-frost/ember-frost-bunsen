const {expect} = chai
import Ember from 'ember'
const {run} = Ember
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-form',
  'FrostBunsenFormComponent',
  {},
  function () {
    validatePropTypes({
      cancelLabel: PropTypes.string,
      inline: PropTypes.bool,
      model: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      onCancel: PropTypes.func,
      onChange: PropTypes.func,
      onSubmit: PropTypes.func,
      onValidation: PropTypes.func,
      renderers: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      submitLabel: PropTypes.string,
      validators: PropTypes.array,
      value: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ]),
      view: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })

    let component, onChangeSpy, onValidationSpy, sandbox

    beforeEach(function () {
      sandbox = sinon.sandbox.create()
      component = this.subject()
      onChangeSpy = sandbox.spy()
      onValidationSpy = sandbox.spy()

      run(() => {
        component.setProperties({
          model: {
            properties: {
              bar: {type: 'string'},
              baz: {type: 'number'},
              foo: {type: 'string'}
            },
            required: ['foo'],
            type: 'object'
          },
          onChange: onChangeSpy,
          onValidation: onValidationSpy
        })
      })
    })

    afterEach(function () {
      sandbox.restore()
    })

    describe('update bar', function () {
      let updatedValue, validationResult

      beforeEach(function (done) {
        run(() => {
          component.actions.onChange.call(component, 'bar', 'test')
        })

        setTimeout(() => {
          updatedValue = onChangeSpy.lastCall.args[0]
          validationResult = onValidationSpy.lastCall.args[0]
          done()
        }, 500)
      })

      it('store gets expected formValue', function () {
        const store = component.get('store')
        expect(store.formValue).to.eql({
          bar: 'test'
        })
      })

      it('onChange gets expected value', function () {
        expect(updatedValue).to.eql({
          bar: 'test'
        })
      })

      it('onValidation gets expected validation errors', function () {
        expect(validationResult.errors.length).to.eql(1)

        const error = validationResult.errors[0]

        expect(error.code).to.eql('OBJECT_MISSING_REQUIRED_PROPERTY')
        expect(error.message).to.eql('Field is required.')
        expect(error.path).to.eql('#/foo')
      })

      it('onValidation gets expected validation warnings', function () {
        expect(validationResult.warnings).to.eql([])
      })
    })

    describe('update baz', function () {
      let updatedValue, validationResult

      beforeEach(function (done) {
        run(() => {
          component.actions.onChange.call(component, 'baz', 42)
        })

        setTimeout(() => {
          updatedValue = onChangeSpy.lastCall.args[0]
          validationResult = onValidationSpy.lastCall.args[0]
          done()
        }, 500)
      })

      it('store gets expected formValue', function () {
        const store = component.get('store')
        expect(store.formValue).to.eql({
          baz: 42
        })
      })

      it('onChange gets expected value', function () {
        expect(updatedValue).to.eql({
          baz: 42
        })
      })

      it('onValidation gets expected validation errors', function () {
        expect(validationResult.errors.length).to.eql(1)

        const error = validationResult.errors[0]

        expect(error.code).to.eql('OBJECT_MISSING_REQUIRED_PROPERTY')
        expect(error.message).to.eql('Field is required.')
        expect(error.path).to.eql('#/foo')
      })

      it('onValidation gets expected validation warnings', function () {
        expect(validationResult.warnings).to.eql([])
      })
    })

    describe('update foo', function () {
      let updatedValue, validationResult

      beforeEach(function (done) {
        run(() => {
          component.actions.onChange.call(component, 'foo', 'test')
        })

        setTimeout(() => {
          updatedValue = onChangeSpy.lastCall.args[0]
          validationResult = onValidationSpy.lastCall.args[0]
          done()
        }, 500)
      })

      it('store gets expected formValue', function () {
        const store = component.get('store')
        expect(store.formValue).to.eql({
          foo: 'test'
        })
      })

      it('onChange gets expected value', function () {
        expect(updatedValue).to.eql({
          foo: 'test'
        })
      })

      it('onValidation gets expected validation errors', function () {
        expect(validationResult.errors).to.eql([])
      })

      it('onValidation gets expected validation warnings', function () {
        expect(validationResult.warnings).to.eql([])
      })
    })

    describe('store', function () {
      let store

      beforeEach(function () {
        store = component.get('store')
      })

      it('has expected formValue', function () {
        expect(store.formValue).to.eql({})
      })

      it('has expected renderers', function () {
        expect(store.renderers).to.eql({
          'multi-select': 'frost-bunsen-input-multi-select',
          'property-chooser': 'frost-bunsen-property-chooser',
          select: 'frost-bunsen-input-select'
        })
      })
    })
  }
)
