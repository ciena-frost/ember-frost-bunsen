import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-array-tab-nav',
  'Unit: Component | frost-bunsen-array-tab-nav',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenView: {},
        cellConfig: {},
        index: 1,
        onRemove () {}
      })
    })

    validatePropTypes({
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      formDisabled: PropTypes.bool,
      index: PropTypes.number.isRequired,
      onRemove: PropTypes.func.isRequired,
      renderers: PropTypes.oneOfType([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      showAllErrors: PropTypes.bool
    })
  }
)
