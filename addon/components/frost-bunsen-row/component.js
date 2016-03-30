import Ember from 'ember'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-row'],
  layout,

  propTypes: {
    bunsenId: PropTypes.string,
    cellConfigs: PropTypes.array.isRequired,
    defaultClassName: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false
})
