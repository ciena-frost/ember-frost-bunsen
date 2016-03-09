import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../../../utils/template'

describeComponent(
  'frost-bunsen-form',
  'FrostBunsenFormComponent',
  {},
  function () {
    validatePropTypes({
      cancelLabel: PropTypes.string,
      initialValue: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      inline: PropTypes.bool,
      model: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      'on-cancel': PropTypes.func,
      'on-change': PropTypes.func,
      'on-submit': PropTypes.func,
      'on-validation': PropTypes.func,
      renderers: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      submitLabel: PropTypes.string,
      validators: PropTypes.array,
      view: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })
  }
)
