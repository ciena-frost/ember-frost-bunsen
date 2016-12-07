import Ember from 'ember'
const {Component} = Ember
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-bunsen-description-bubble'

export default Component.extend(PropTypesMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-description-bubble'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    description: PropTypes.string.isRequired
  }
})
