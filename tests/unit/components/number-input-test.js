import {expect} from 'chai'
const {run} = Ember
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-number',
  'FrostBunsenInputNumberComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      run(() => {
        component.setProperties({
          bunsenId: 'name',
          cellConfig: Ember.Object.create({}),
          model: {},
          onChange () {},
          store: Ember.Object.create({}),
          state: Ember.Object.create({})
        })
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

    it('onBlur action sets showErrorMessages to true', function () {
      run(() => {
        component.set('showErrorMessages', true)
      })

      component.get('actions.onBlur').call(component)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    it('onFocus action sets showErrorMessages to false', function () {
      run(() => {
        component.set('showErrorMessages', false)
      })

      component.get('actions.onFocus').call(component)
      expect(component.get('showErrorMessages')).to.be.truthy
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        run(() => {
          component.set('onChange', undefined)
        })
      })

      it('does not throw an error when onChange action is triggered', function () {
        expect(function () {
          const e = {
            value: '1'
          }
          component.get('actions.onChange').call(component, e)
        }).not.to.throw(Error)
      })
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
          run(() => {
            component.set('value', test.in)
          })

          expect(component.get('renderValue')).to.equal(test.out)
        })
      })
    })
  }
)
