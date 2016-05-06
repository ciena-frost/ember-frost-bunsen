import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {renderErrorMessageTests} from 'dummy/tests/helpers/abstract-input'

describeComponent(
  'frost-bunsen-input-number',
  'FrostBunsenInputNumberComponent',
  {},
  function () {
    const ctx = {}
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
      ctx.component = component
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

    renderErrorMessageTests(ctx)

    it('onBlur action sets showErrorMessage to true', function () {
      component.set('showErrorMessage', true)
      component.get('actions.onBlur').call(component)
      expect(component.get('renderErrorMessage')).to.not.be.null
    })

    it('onFocus action sets showErrorMessage to false', function () {
      component.set('showErrorMessage', true)
      component.get('actions.onFocus').call(component)
      expect(component.get('showErrorMessage')).to.be.false
    })

    describe('when onChange property is omitted', function () {
      beforeEach(function () {
        component.set('onChange', undefined)
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
          component.set('value', test.in)
          expect(component.get('renderValue')).to.equal(test.out)
        })
      })
    })
  }
)
