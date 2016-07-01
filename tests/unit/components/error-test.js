import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-error',
  'FrostBunsenErrorComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        data: {}
      })
    })

    validatePropTypes({
      data: PropTypes.object.isRequired,
      warning: PropTypes.bool
    })
  }
)
