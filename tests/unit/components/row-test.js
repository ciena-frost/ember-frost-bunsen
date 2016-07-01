import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-row',
  'FrostBunsenRowComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfigs: [],
        errors: {},
        onChange () {},
        value: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfigs: PropTypes.array.isRequired,
      defaultClassName: PropTypes.string,
      errors: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      value: PropTypes.object.isRequired
    })
  }
)
