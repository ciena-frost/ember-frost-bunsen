import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-frost-component'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-validation-result',
  'FrostBunsenValidationResultComponent',
  {},
  function () {
    validatePropTypes({
      model: PropTypes.object.isRequired
    })
  }
)
