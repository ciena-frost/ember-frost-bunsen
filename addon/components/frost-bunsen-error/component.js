import Ember from 'ember'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypesMixin, {
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
