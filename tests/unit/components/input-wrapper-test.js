import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-wrapper',
  'Unit: Component | frost-bunsen-input-wrapper',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenId: 'foo',
        bunsenStore: Ember.Object.create({})
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject,
      onChange: PropTypes.func,
      readOnly: PropTypes.bool,
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
  }
)
