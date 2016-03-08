import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-frost-component'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-container-array',
  'FrostBunsenContainerArrayComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      model: PropTypes.object.isRequired,
      'on-change': PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired
    })
  }
)
