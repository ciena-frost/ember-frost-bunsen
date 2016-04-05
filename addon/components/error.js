import Ember from 'ember'
const {Component} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

export default Component.extend(PropTypeMixin, {
  classNameBindings: ['warning:alert-warning:alert-danger'],
  classNames: ['frost-bunsen-error'],

  propTypes: {
    data: PropTypes.object.isRequired,
    warning: PropTypes.bool
  },

  getDefaultProps () {
    return {
      warning: false
    }
  }
})
