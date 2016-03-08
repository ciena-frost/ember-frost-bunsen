import FrostComponent, {PropTypes} from 'ember-frost-component'
import layout from './template'

export default FrostComponent.extend({
  classNameBindings: ['warning:alert-warning:alert-danger'],
  classNames: ['frost-bunsen-error'],
  layout,

  propTypes: {
    data: PropTypes.object.isRequired,
    warning: PropTypes.bool
  },

  // Defaults
  warning: false
})
