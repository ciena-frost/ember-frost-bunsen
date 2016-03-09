import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-input',
  'FrostBunsenInputComponent',
  {},
  function () {
    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject,
      initialValue: PropTypes.oneOf([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ]),
      model: PropTypes.object.isRequired,
      'on-change': PropTypes.func,
      readOnly: PropTypes.bool,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired
    })
  }
)
