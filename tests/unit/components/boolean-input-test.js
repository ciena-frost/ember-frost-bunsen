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
