import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-input-text',
  'Unit: Component | frost-bunsen-input-text',
  {
    unit: true
  },
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        onChange () {},
        state: Ember.Object.create({})
      })
      ctx.component = component
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOfType([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
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
