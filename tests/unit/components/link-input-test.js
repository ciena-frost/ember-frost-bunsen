import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-link',
  'Unit: Component | frost-bunsen-input-link',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'url',
        bunsenModel: {},
        bunsenView: {},
        cellConfig: {},
        onChange () {},
        state: Ember.Object.create({})
      })
      ctx.component = component
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenView: PropTypes.object.isRequired,
      cellConfig: PropTypes.object.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      formDisabled: PropTypes.bool,
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      showAllErrors: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })
  }
)
