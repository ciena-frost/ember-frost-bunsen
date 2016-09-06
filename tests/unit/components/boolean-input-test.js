import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-boolean',
  'Unit: Component | frost-bunsen-input-boolean',
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
        bunsenView: {},
        cellConfig: {},
        onChange () {},
        state: Ember.Object.create({value: true})
      })
      ctx.component = component
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      formDisabled: PropTypes.bool,
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      showAllErrors: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
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
