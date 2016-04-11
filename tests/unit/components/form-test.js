import {describeComponent} from 'ember-mocha'
import {PropTypes} from 'ember-prop-types'
import {validatePropTypes} from '../../utils/template'

describeComponent(
  'frost-bunsen-form',
  'FrostBunsenFormComponent',
  {},
  function () {
    validatePropTypes({
      cancelLabel: PropTypes.string,
      inline: PropTypes.bool,
      model: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]).isRequired,
      onCancel: PropTypes.func,
      onChange: PropTypes.func,
      onSubmit: PropTypes.func,
      onValidation: PropTypes.func,
      renderers: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ]),
      submitLabel: PropTypes.string,
      validators: PropTypes.array,
      value: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.null,
        PropTypes.object
      ]),
      view: PropTypes.oneOf([
        PropTypes.EmberObject,
        PropTypes.object
      ])
    })
  }
)
