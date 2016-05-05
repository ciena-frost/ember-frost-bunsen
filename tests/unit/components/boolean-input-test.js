import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-boolean',
  'FrostBunsenInputBooleanComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'enabled',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({value: true})
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

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        component.set('onChange', undefined)
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          const e = {
            value: true
          }
          component.get('actions.onChange').call(component, e)
        }).not.to.throw(Error)
      })
    })

    describe('checked', function () {
      [
        {in: null, out: false},
        {in: undefined, out: false},
        {in: false, out: false},
        {in: true, out: true},
        {in: 'false', out: false},
        {in: 'true', out: true},
        {in: 'False', out: false},
        {in: 'True', out: true},
        {in: 'FALSE', out: false},
        {in: 'TRUE', out: true}
      ].forEach((test) => {
        it(`returns ${test.out} when value is ${test.in} (${typeof test.in})`, function () {
          component.set('value', test.in)
          expect(component.get('checked')).to.equal(test.out)
        })
      })
    })
  }
)
