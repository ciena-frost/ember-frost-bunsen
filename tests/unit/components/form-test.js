import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-form',
  'FrostBunsenFormComponent',
  {},
  function () {
    validatePropTypes({
      cancelLabel: PropTypes.string,
      disabled: PropTypes.bool,
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
      showAllErrors: PropTypes.bool,
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
      onChangeSpy = sandbox.spy()
      onValidationSpy = sandbox.spy()
      component = this.subject({
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

    afterEach(function () {
      sandbox.restore()
    })

    describe('containerTabs', function () {
      describe('when one root container', function () {
        beforeEach(function () {
          component.set('view', {
            containers: [{
              id: 'main',
              rows: [
                [{model: 'foo'}],
                [{model: 'bar'}],
                [{model: 'baz'}]
              ]
            }],
            rootContainers: [{
              container: 'main',
              label: 'Main'
            }],
            type: 'form',
            version: '1.0'
          })
        })

        it('returns empty array', function () {
          expect(component.get('containerTabs')).to.eql([])
        })
      })

      describe('when multiple root containers', function () {
        beforeEach(function () {
          component.set('view', {
            containers: [
              {
                id: 'one',
                rows: [
                  [{model: 'foo'}],
                  [{model: 'bar'}]
                ]
              },
              {
                id: 'two',
                rows: [
                  [{model: 'baz'}]
                ]
              }
            ],
            rootContainers: [
              {
                container: 'one',
                label: 'One'
              },
              {
                container: 'two',
                label: 'Two'
              }
            ],
            type: 'form',
            version: '1.0'
          })
        })

        it('returns expected array of tabs', function () {
          expect(component.get('containerTabs')).to.eql([
            {
              alias: 'One',
              id: 0
            },
            {
              alias: 'Two',
              id: 1
            }
          ])
        })
      })
    })

    it('actions.onTabChange() updates selectedTabIndex', function () {
      [0, 1, 2].forEach((index) => {
        component.actions.onTabChange.call(component, index)
        expect(component.get('selectedTabIndex')).to.eql(index)
      })
    })

    describe('update bar', function () {
      let updatedValue, validationResult

      beforeEach(function (done) {
        component.actions.onChange.call(component, 'bar', 'test')

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
        component.actions.onChange.call(component, 'baz', 42)

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
        component.actions.onChange.call(component, 'foo', 'test')

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

    describe('when disabled is true', function () {
      let store

      beforeEach(function () {
        component.set('disabled', true)
        store = component.get('store')
      })

      it('store has disabled value', function () {
        expect(store.disabled).to.be.true
      })
    })

    describe('when disabled is false', function () {
      let store

      beforeEach(function () {
        component.set('disabled', false)
        store = component.get('store')
      })

      it('store has disabled value', function () {
        expect(store.disabled).to.be.false
      })
    })

    describe('when showAllErrors is true', function () {
      let store

      beforeEach(function () {
        component.set('showAllErrors', true)
        store = component.get('store')
      })

      it('store has showAllErrors value', function () {
        expect(store.showAllErrors).to.be.true
      })
    })

    describe('when showAllErrors is false', function () {
      let store

      beforeEach(function () {
        component.set('showAllErrors', false)
        store = component.get('store')
      })

      it('store has showAllErrors value', function () {
        expect(store.showAllErrors).to.be.false
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
          boolean: 'frost-bunsen-input-boolean',
          'button-group': 'frost-bunsen-input-button-group',
          'multi-select': 'frost-bunsen-input-multi-select',
          number: 'frost-bunsen-input-number',
          'property-chooser': 'frost-bunsen-property-chooser',
          select: 'frost-bunsen-input-select',
          string: 'frost-bunsen-input-text'
        })
      })
    })
  }
)
