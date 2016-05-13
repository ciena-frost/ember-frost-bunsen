import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from '../utils'
import {getCellDefaults} from '../validator/defaults'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  propTypes: {
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
  },

  getDefaultProps () {
    return {
      required: false,
      showErrorMessage: false
    }
  },

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('errorMessage', 'showErrorMessage', 'store.showAllErrors')
  renderErrorMessage (errorMessage, showErrorMessage, showAllErrors) {
    if (!showAllErrors && !showErrorMessage) {
      return null
    }

    return errorMessage
  },

  @readOnly
  @computed('renderErrorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  inputClassName (errorMessage) {
    return errorMessage ? 'error' : ''
  },

  @readOnly
  @computed('cellConfig.inputClassName')
  /**
   * Get class name for input wrapper element
   * @param {String} inputClassName - class name defined in view definition
   * @returns {String} input wrapper element class name
   */
  inputWrapperClassName (inputClassName) {
    return inputClassName || defaultClassNames.inputWrapper
  },

  @readOnly
  @computed('cellConfig.labelClassName')
  /**
   * Get class name for label wrapper element
   * @param {String} labelClassName - class name defined in view definition
   * @returns {String} label wrapper element class name
   */
  labelWrapperClassName (labelClassName) {
    return labelClassName || defaultClassNames.labelWrapper
  },

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
  renderLabel (bunsenId, cellConfig, label, model) {
    const config = _.defaults({}, cellConfig, getCellDefaults())
    const customLabel = label || config.label
    return getLabel(customLabel, model, bunsenId)
  },

  @readOnly
  @computed('value', 'cellConfig.readTransforms')
  transformedValue (value, transforms) {
    if (!_.isString(value)) {
      return value
    }

    return this.applyTransforms(value, transforms)
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  /**
   * Apply transform to value
   * @param {String} value - value to transform
   * @param {Transform} transform - transform to apply
   * @returns {String} transformed value
   */
  applyTransform (value, transform) {
    const flags = (transform.global === false ? '' : 'g')

    if (transform.regex) {
      const pattern = new RegExp(transform.from, flags)
      return value.replace(pattern, transform.to)
    }

    return value.split(transform.from).join(transform.to)
  },

  /**
   * Transform a value based on a set of transforms
   * @param {String} value - value to apply transforms to
   * @param {Array<Transform>} transforms - transforms to apply to value
   * @returns {String} transformed value
   */
  applyTransforms (value, transforms) {
    if (!transforms || transforms.length === 0) {
      return value
    }

    return transforms.reduce(this.applyTransform.bind(this), value)
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return _.find([data.value, _.get(data, 'target.value'), data], function (value) {
      return !_.isUndefined(value)
    })
  },

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    /**
     * When input looses focus we want to start showing error messages
     */
    onBlur () {
      if (!this.get('showErrorMessage')) {
        this.set('showErrorMessage', true)
      }
    },

    /**
     * When input enters focus we want to stop showing error messages
     */
    onFocus () {
      if (this.get('showErrorMessage')) {
        this.set('showErrorMessage', false)
      }
    },

    /**
     * Handle user updating value
     * @param {Event} e - event data
     */
    onChange (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = this.parseValue(e)
      const transforms = this.get('cellConfig.writeTransforms')
      const transformedNewValue = this.applyTransforms(newValue, transforms)
      const oldValue = this.get('value')
      const onChange = this.get('onChange')

      if (onChange && !_.isEqual(transformedNewValue, oldValue)) {
        onChange(bunsenId, transformedNewValue)
      }
    }
  }
})
