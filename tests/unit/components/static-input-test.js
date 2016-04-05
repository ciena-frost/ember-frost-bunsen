const {run} = Ember
import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-input-static',
  'FrostBunsenInputStaticComponent',
  {},
  function () {
    let component

    beforeEach(function () {
      component = this.subject()

      run(() => {
        component.setProperties({
          bunsenId: 'name',
          cellConfig: Ember.Object.create({}),
          model: {},
          onChange () {},
          store: Ember.Object.create({}),
          state: Ember.Object.create({})
        })
      })
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
  }
)
