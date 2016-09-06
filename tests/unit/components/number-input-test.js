import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-number',
  'Unit: Component | frost-bunsen-input-number',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        bunsenModel: {},
        bunsenView: {},
        cellConfig: {},
        onChange () {},
        state: Ember.Object.create({})
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
      registerForFormValueChanges: PropTypes.func,
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

    describe('parseValue', function () {
      [
        {in: 0, out: 0},
        {in: 0.5, out: 0.5},
        {in: 1, out: 1},
        {in: '0', out: 0},
        {in: '0.5', out: 0.5},
        {in: '1', out: 1},
        {in: '', out: null},
        {in: undefined, out: null},
        {in: null, out: null},
        {in: 'test', out: null}
      ].forEach((test) => {
        it(`expect to return ${test.out} when input is ${test.in} (${typeof test.in})`, function () {
          const result = component.parseValue(test.in)
          expect(result).to.equal(test.out)
        })
      })
    })

    describe('renderValue', function () {
      [
        {in: null, out: ''},
        {in: undefined, out: ''},
        {in: '', out: ''},
        {in: 'test', out: 'test'}
      ].forEach((test) => {
        it(`returns "${test.out}" when value is ${test.in} (${typeof test.in})`, function () {
          component.set('value', test.in)
          expect(component.get('renderValue')).to.equal(test.out)
        })
      })
    })
  }
)
