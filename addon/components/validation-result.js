import Ember from 'ember'
const {Component} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-validation-result'],

  propTypes: {
    model: PropTypes.object.isRequired
  }
})
