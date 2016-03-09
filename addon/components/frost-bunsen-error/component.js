import Ember from 'ember'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypeMixin, {
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
