import Ember from 'ember'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypesMixin, {
  classNames: ['frost-bunsen-validation-result'],
  layout,

  propTypes: {
    model: PropTypes.object.isRequired
  }
})
