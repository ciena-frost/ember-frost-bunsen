import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-error'

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNameBindings: ['warning:frost-bunsen-alert-warning:frost-bunsen-alert-danger'],
  classNames: ['frost-bunsen-error'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    data: PropTypes.object.isRequired,
    warning: PropTypes.bool
  },

  getDefaultProps () {
    return {
      warning: false
    }
  },

  @readOnly
  @computed('warning')
  errorType (warning) {
    return warning ? 'WARNING' : 'ERROR'
  }
})
