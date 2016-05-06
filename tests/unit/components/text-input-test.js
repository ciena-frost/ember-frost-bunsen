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

    describe('renderErrorMessage when error message present', function () {
      let errorMessage

      beforeEach(function () {
        errorMessage = 'Things are borked'
        component.set('errorMessage', errorMessage)
      })

      describe('when store.showAllErrors is true', function () {
        beforeEach(function () {
          component.set('store.showAllErrors', true)
        })

        it('returns error messages when showErrorMessage is true', function () {
          component.set('showErrorMessage', true)
          expect(component.get('renderErrorMessage')).to.equal(errorMessage)
        })

        it('returns error messages when showErrorMessage is false', function () {
          component.set('showErrorMessage', false)
          expect(component.get('renderErrorMessage')).to.equal(errorMessage)
        })
      })

      describe('when store.showAllErrors is false', function () {
        beforeEach(function () {
          component.set('store.showAllErrors', false)
        })

        it('returns error messages when showErrorMessage is true', function () {
          component.set('showErrorMessage', true)
          expect(component.get('renderErrorMessage')).to.equal(errorMessage)
        })

        it('returns null when showErrorMessage is false', function () {
          component.set('showErrorMessage', false)
          expect(component.get('renderErrorMessage')).to.be.null
        })
      })
    })

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
            target: 'John'
          }
          component.get('actions.onChange').call(component, e)
        }).not.to.throw(Error)
      })
    })
  }
)
