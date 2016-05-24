import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-error',
  'FrostBunsenErrorComponent',
  {
    unit: true
  },
  function () {
    validatePropTypes({
      data: PropTypes.object.isRequired,
      warning: PropTypes.bool
    })
  }
)
