import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-cell',
  'FrostBunsenCellComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string,
      config: PropTypes.EmberObject.isRequired,
      defaultClassName: PropTypes.string,
      errors: PropTypes.object.isRequired,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })
  }
)
