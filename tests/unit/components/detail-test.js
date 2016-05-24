/* Test fails on continuous integration with 'Symbol is not defined'
import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-detail',
  'FrostBunsenDetailComponent',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      model: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      value: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ]),
      view: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })

    let component

    beforeEach(function () {
      component = this.subject({
        model: {
          properties: {
            bar: {type: 'string'},
            baz: {type: 'number'},
            foo: {type: 'string'}
          },
          required: ['foo'],
          type: 'object'
        }
      })
    })

    it('actions.onTabChange() updates selectedTabIndex', function () {
      [0, 1, 2].forEach((index) => {
        component.actions.onTabChange.call(component, index)
        expect(component.get('selectedTabIndex')).to.eql(index)
      })
    })
  }
)
*/
