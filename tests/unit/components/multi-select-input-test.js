import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {beforeEach} from 'mocha'
import {validatePropTypes} from 'dummy/tests/helpers/template'
import {disabledTests, renderErrorMessageTests} from 'dummy/tests/helpers/abstract-input'

describeComponent(
  'frost-bunsen-input-multi-select',
  'FrostBunsenInputMultiSelectComponent',
  {},
  function () {
    const ctx = {}
    let component

    beforeEach(function () {
      component = this.subject({
        bunsenId: 'name',
        cellConfig: Ember.Object.create({}),
        model: {},
        onChange () {},
        store: Ember.Object.create({}),
        state: Ember.Object.create({})
      })
      ctx.component = component
    })

    validatePropTypes({
      bunsenId: PropTypes.string.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      errorMessage: PropTypes.oneOf([
        PropTypes.null,
        PropTypes.string
      ]),
      label: PropTypes.string,
      model: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      store: PropTypes.EmberObject.isRequired,
      value: PropTypes.oneOf([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.null,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string
      ])
    })

    disabledTests(ctx)
    renderErrorMessageTests(ctx)
  }
)
