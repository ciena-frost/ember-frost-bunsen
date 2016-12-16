import Ember from 'ember'
const {Component} = Ember
import {HookMixin} from 'ember-hook'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-bunsen-description-bubble'

export default Component.extend(HookMixin, PropTypesMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-description-bubble'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    description: PropTypes.string
  }
})
