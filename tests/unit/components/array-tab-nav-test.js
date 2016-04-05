import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-array-tab-nav',
  'FrostBunsenArrayTabNavComponent',
  {},
  function () {
    validatePropTypes({
      cellConfig: PropTypes.EmberObject.isRequired,
      index: PropTypes.number.isRequired,
      model: PropTypes.object.isRequired,
      onRemove: PropTypes.func.isRequired,
      store: PropTypes.EmberObject.isRequired
    })
  }
)
