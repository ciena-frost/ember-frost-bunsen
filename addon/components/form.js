/* global $ */
import 'ember-frost-bunsen/typedefs'

import {validate} from '../actions'

import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'
import {PropTypes} from 'ember-prop-types'
import DetailComponent from './detail'
import {getButtonLabelDefaults} from '../validator/defaults'

export default DetailComponent.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNameBindings: ['inline:inline:not-inline'],

  propTypes: {
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
  },

  getDefaultProps () {
    return {
      classNames: ['frost-bunsen-form'],
      renderers: {},
      validators: [],
      value: null
    }
  },

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('onCancel', 'onSumbit')
  hasButtons (onCancel, onSubmit) {
    return !_.isEmpty(onCancel) || !_.isEmpty(onSubmit)
  },

  @readOnly
  @computed('propValidationResult')
  isInvalid (propValidationResult) {
    return !_.isEmpty(propValidationResult.errors)
  },

  @readOnly
  @computed('cancelLabel', 'renderView', 'submitLabel')
  buttonLabels (cancelLabel, view, submitLabel) {
    return _.defaults(
      {
        cancel: cancelLabel,
        submit: submitLabel
      },
      view.buttonLabels,
      getButtonLabelDefaults()
    )
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  /**
   * After render select first input unless something else already has focus on page
   */
  didRender () {
    // If there is already an element in focus do nothing
    if ($(':focus').length !== 0) {
      return
    }

    // Focus on first input in busen form
    this.$(':input:enabled:visible:first').focus()
  },

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    /**
     * Handle when user updates form value
     * @param {String} bunsenId - ID of input that changed
     * @param {Object} inputValue - new value for input that changed
     */
    onChange (bunsenId, inputValue) {
      const reduxStore = this.get('reduxStore')

      reduxStore.dispatch(
        validate(bunsenId, inputValue, this.get('renderModel'), this.get('validators'))
      )
    },

    /**
     * Handle when user submits form
     * @param {Event} e - event
     */
    onSubmit (e) {
      e.preventDefault()

      const onSubmit = this.get('onSubmit')
      const renderValue = this.get('renderValue')

      if (onSubmit) {
        onSubmit(renderValue)
      }
    }
  }
})
