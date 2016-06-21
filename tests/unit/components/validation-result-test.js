import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-validation-result',
  'FrostBunsenValidationResultComponent',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      model: PropTypes.object.isRequired
    })
  }
)
