import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-container',
  'Unit: Component | frost-bunsen-container',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        errors: {},
        onChange () {},
        value: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      value: PropTypes.object.isRequired
    })
  }
)
