import Ember from 'ember'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-validation-result'],
  layout,

  propTypes: {
    model: PropTypes.object.isRequired
  }
})
