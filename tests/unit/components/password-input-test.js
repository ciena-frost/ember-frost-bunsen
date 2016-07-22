import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-password',
  'Unit: Component | frost-bunsen-input-password',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'password',
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        onChange () {},
        state: Ember.Object.create({})
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

    it('onFocusOut action sets showErrorMessage to true', function () {
      component.set('showErrorMessage', true)
      component.get('actions.onFocusOut').call(component)
      expect(component.get('renderErrorMessage')).to.not.be.null
    })

    it('onFocusIn action sets showErrorMessage to false', function () {
      component.set('showErrorMessage', true)
      component.get('actions.onFocusIn').call(component)
      expect(component.get('showErrorMessage')).to.be.false
    })
  }
)
