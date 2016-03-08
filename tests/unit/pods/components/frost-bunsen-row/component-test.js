import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-frost-component'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-row',
  'FrostBunsenRowComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string,
      cellConfigs: PropTypes.array.isRequired,
      defaultClassName: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired
    })
  }
)
