import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-section',
  'FrostBunsenSectionComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        required: false,
        title: 'Test'
      })
    })

    validatePropTypes({
      collapsible: PropTypes.bool,
      expanded: PropTypes.bool,
      expandedOnInitialRender: PropTypes.bool,
      instructions: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      onToggle: PropTypes.func,
      renderContentWhenCollapsed: PropTypes.bool,
      required: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired
    })
  }
)
