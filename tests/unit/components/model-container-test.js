import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-model-container',
  'FrostBunsenContainerModelComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenId: 'foo',
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        errors: {},
        onChange () {},
        value: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      label: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      value: PropTypes.object.isRequired
    })
  }
)
