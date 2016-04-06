import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import {PropTypes} from 'ember-prop-types'
import {getCellDefaults} from '../validator/defaults'
import {getLabel, getInitialValue} from '../utils'

import layout from './template'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Ember.Component.extend({
  classNames: [
    'frost-bunsen-input-number',
    'frost-field'
  ],

  layout,

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    initialValue: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string
    ]),
    label: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    reduxStore: PropTypes.object.isRequired,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  required: false,

  @readOnly
  @computed('errorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  inputClassName: function (errorMessage) {
    return errorMessage ? 'error' : ''
  },

  // Schema stuff, not a problem
  @readOnly
  @computed('cellConfig.inputClassName')
  /**
   * Get class name for input wrapper element
   * @param {String} inputClassName - class name defined in view definition
   * @returns {String} input wrapper element class name
   */
  inputWrapperClassName: function (inputClassName) {
    return inputClassName || defaultClassNames.inputWrapper
  },

  // Schema stuff, not a problem
  @readOnly
  @computed('cellConfig.labelClassName')
  /**
   * Get class name for label wrapper element
   * @param {String} labelClassName - class name defined in view definition
   * @returns {String} label wrapper element class name
   */
  labelWrapperClassName: function (labelClassName) {
    return labelClassName || defaultClassNames.labelWrapper
  },

  // Schema stuff, not a problem
  @readOnly
  @computed('bunsenId', 'cellConfig', 'label', 'model')
  /**
   * Get current label text for input
   * @param {String} bunsenId - bunsen ID for input (represents path in model)
   * @param {BunsenCell} cellConfig - view definition for input
   * @param {String} label - label
   * @param {BunsenModel} model - bunsen model
   * @returns {String} label text
   */
  renderLabel: function (bunsenId, cellConfig, label, model) {
    const config = _.defaults({}, cellConfig, getCellDefaults())
    const customLabel = label || config.label
    return getLabel(customLabel, model, bunsenId)
  },

  init: function () {
    this._super()

    const bunsenId = this.get('bunsenId')

    let initialValue = getInitialValue(
      bunsenId,
      this.get('store.formValue'),
      this.get('initialValue'),
      this.get('model') || {}
    )

    // Note: State must be set in init method so input instances don't share same state
    this.set('state', Ember.Object.extend({
      hasUserInteracted: false,
      value: initialValue
    }).create())
  },

  /**
   * Text to render for value
   * @returns {String} text to render
   */
  renderValue: Ember.computed(function () {
    const bunsenId = this.get('bunsenId')
    return _.toString(this.get('reduxStore').getState()['value'][bunsenId])
  }),

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    onChange (e) {
      if (!this.get('state.hasUserInteracted')) {
        this.set('state.hasUserInteracted', true)
      }
      const reduxStore = this.get('reduxStore')
      const newValue = parseFloat(e.value || e.target.value)
      const onChange = this.get('onChange')
      if (onChange) {
        onChange(this.get('bunsenId'), newValue)
      }
    }
  }
})
