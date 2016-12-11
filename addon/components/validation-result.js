import Ember from 'ember'
const {Component} = Ember
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-validation-result'

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-validation-result'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    model: PropTypes.shape({
      errors: PropTypes.array,
      warnings: PropTypes.array
    }).isRequired,
    type: PropTypes.string.isRequired
  }
})
