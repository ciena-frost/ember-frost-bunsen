import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-model-container',
  'FrostBunsenContainerModelComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })
  }
)
