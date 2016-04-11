import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-section',
  'FrostBunsenSectionComponent',
  {},
  function () {
    validatePropTypes({
      collapsible: PropTypes.bool,
      expanded: PropTypes.bool,
      expandedOnInitialRender: PropTypes.bool,
      instructions: PropTypes.string,
      onToggle: PropTypes.func,
      renderContentWhenCollapsed: PropTypes.bool,
      required: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired
    })
  }
)
