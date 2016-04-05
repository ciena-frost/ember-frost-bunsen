import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-array-inline-item',
  'FrostBunsenArrayInlineItemComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errors: PropTypes.object.isRequired,
      index: PropTypes.number.isRequired,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
      readOny: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.object.isRequired
    })
  }
)
