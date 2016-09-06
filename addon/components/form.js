/* global $ */
import Ember from 'ember'
const {RSVP} = Ember
import {validate} from 'bunsen-core/actions'

import {PropTypes} from 'ember-prop-types'
import DetailComponent from './detail'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-form'

export default DetailComponent.extend({
  // == Component Properties ===================================================

  layout,

  // == State Properties =======================================================

  propTypes: {
    autofocus: PropTypes.bool,
    bunsenModel: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    bunsenView: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    disabled: PropTypes.bool,
    hook: PropTypes.string,
    onChange: PropTypes.func,
    onValidation: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    regiteredComponents: PropTypes.array,
    showAllErrors: PropTypes.bool,
    validators: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.null,
      PropTypes.object
    ])
  },

  getDefaultProps () {
    return {
      autofocus: true,
      classNames: ['frost-bunsen-form'],
      disabled: false,
      hook: 'bunsenForm',
      renderers: {},
      registeredComponents: [],
      showAllErrors: false,
      validators: [],
      value: null
    }
  },

  // == Functions ==============================================================

  /**
   * After render select first input unless something else already has focus on page
   */
  didRender () {
    if (!this.get('autofocus')) {
      return
    }

    // If there is already an element in focus do nothing
    if ($(':focus').length !== 0) {
      return
    }

    // Focus on first input in busen form
    this.$(':input:enabled:visible:first').focus()
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle when user updates form value
     * @param {String} bunsenId - ID of input that changed
     * @param {Object} inputValue - new value for input that changed
     */
    onChange (bunsenId, inputValue) {
      const reduxStore = this.get('reduxStore')

      reduxStore.dispatch(
        validate(bunsenId, inputValue, this.get('renderModel'), this.get('validators'), RSVP.all)
      )
    }
  }
})
