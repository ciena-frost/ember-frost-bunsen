import Ember from 'ember'
const {Component} = Ember
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-row'],

  propTypes: {
    bunsenId: PropTypes.string,
    cellConfigs: PropTypes.array.isRequired,
    defaultClassName: PropTypes.string,
    errors: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  }
})
