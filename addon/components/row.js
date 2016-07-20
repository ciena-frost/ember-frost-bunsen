import Ember from 'ember'
const {Component} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: ['frost-bunsen-row'],

  propTypes: {
    bunsenId: PropTypes.string,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfigs: PropTypes.array.isRequired,
    defaultClassName: PropTypes.string,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  }

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  // ==========================================================================
  // Functions
  // ==========================================================================

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================
})
