import {expect} from 'chai'
import {describeComponent} from 'ember-mocha'
import {beforeEach, it} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-detail',
  'Unit : FrostBunsenDetailComponent',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      bunsenModel: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      bunsenView: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      value: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ])
    })

    let component, bunsenModel, value

    beforeEach(function () {
      bunsenModel = {
        properties: {
          bar: {type: 'string'},
          baz: {type: 'number'},
          foo: {type: 'string'}
        },
        required: ['foo'],
        type: 'object'
      }

      value = {
        bar: 'bar',
        baz: null
      }

      component = this.subject({
        bunsenModel,
        value
      })
    })

    it('actions.onTabChange() updates selectedTabIndex', function () {
      [0, 1, 2].forEach((index) => {
        component.actions.onTabChange.call(component, index)
        expect(component.get('selectedTabIndex')).to.eql(index)
      })
    })

    it('initializes the store with an initial value on init', function () {
      const expectedValue = {
        bar: 'bar'
      }
      const state = component.get('reduxStore').getState()

      expect(state.value).to.eql(expectedValue)
    })
  }
)
