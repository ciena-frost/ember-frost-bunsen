import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {disabledTests, renderErrorMessageTests} from 'dummy/tests/helpers/abstract-input'

describeComponent(
  'frost-bunsen-input-boolean',
  'FrostBunsenInputBooleanComponent',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'enabled',
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        onChange () {},
        state: Ember.Object.create({value: true})
      })
      ctx.component = component
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
