import FrostComponent, {PropTypes} from 'ember-frost-component'
import layout from './template'

export default FrostComponent.extend({
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
