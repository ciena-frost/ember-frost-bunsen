import {describeComponent} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from 'dummy/tests/helpers/template'

describeComponent(
  'frost-bunsen-array-tab-nav',
  'FrostBunsenArrayTabNavComponent',
  {
    unit: true
  },
  function () {
    beforeEach(function () {
      this.subject({
        bunsenModel: {},
        bunsenStore: Ember.Object.create({}),
        cellConfig: Ember.Object.create({}),
        index: 1,
        onRemove () {}
      })
    })

    validatePropTypes({
      bunsenModel: PropTypes.object.isRequired,
      bunsenStore: PropTypes.EmberObject.isRequired,
      cellConfig: PropTypes.EmberObject.isRequired,
      index: PropTypes.number.isRequired,
      onRemove: PropTypes.func.isRequired
    })
  }
)
