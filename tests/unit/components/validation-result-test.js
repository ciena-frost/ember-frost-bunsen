import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-validation-result',
  'FrostBunsenValidationResultComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        model: {
          errors: [],
          warnings: []
        }
      })
    })

    validatePropTypes({
      model: PropTypes.shape({
        errors: PropTypes.array,
        warnings: PropTypes.array
      }).isRequired
    })
  }
)
