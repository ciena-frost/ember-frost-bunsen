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
        bunsenView: {}
      })
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object,
      formDisabled: PropTypes.bool,
      onChange: PropTypes.func,
      readOnly: PropTypes.bool,
      registerForFormValueChanges: PropTypes.func,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      required: PropTypes.bool,
      showAllErrors: PropTypes.bool,
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
