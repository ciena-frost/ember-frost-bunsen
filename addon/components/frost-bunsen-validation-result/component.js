import FrostComponent, {PropTypes} from 'ember-frost-component'
import layout from './template'

export default FrostComponent.extend({
  classNames: ['frost-bunsen-validation-result'],
  layout,

  propTypes: {
    model: PropTypes.object.isRequired
  }
})
