import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-text',
  'FrostBunsenInputTextComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({})
      })
    })

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

    it('shows error messages when store.showErrorMessages and showErrorMessages are true', function () {
      component.set('showErrorMessages', false)
      component.set('store.showAllErrors', true)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    it('shows error messages when store.showErrorMessages is true and showErrorMessages is false', function () {
      component.set('showErrorMessages', true)
      component.set('store.showAllErrors', false)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    it('does not show error messages when store.showErrorMessages and showErrorMessages are false', function () {
      component.set('showErrorMessages', false)
      component.set('store.showAllErrors', false)
      expect(component.get('showErrorMessages')).to.be.falsy
    })

    it('shows error messages when store.showErrorMessages is false and showErrorMessages is true', function () {
      component.set('showErrorMessages', false)
      component.set('store.showAllErrors', true)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    it('onBlur action sets showErrorMessages to true', function () {
      component.set('showErrorMessages', true)
      component.get('actions.onBlur').call(component)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    it('onFocus action sets showErrorMessages to false', function () {
      component.set('showErrorMessages', false)
      component.get('actions.onFocus').call(component)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        component.set('onChange', undefined)
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          const e = {
            target: 'John'
          }
          component.get('actions.onChange').call(component, e)
        }).not.to.throw(Error)
      })
    })
  }
)
