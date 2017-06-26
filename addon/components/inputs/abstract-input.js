import {getCellDefaults, utils} from 'bunsen-core'
const {getLabel, parseVariables} = utils
import Ember from 'ember'
const {Component, Logger, get, merge, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

const {keys} = Object

export const defaultClassNames = {
  inputWrapper: 'frost-bunsen-left-input',
  labelWrapper: 'frost-bunsen-left-label'
}

export default Component.extend(HookMixin, PropTypeMixin, {
  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    errorMessage: PropTypes.oneOfType([
      PropTypes.null,
      PropTypes.string,
      PropTypes.object // For Ember.String.htmlSafe()
    ]),
    formDisabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    registerForFormValueChanges: PropTypes.func,
    registerValidator: PropTypes.func,
    required: PropTypes.bool,
    showAllErrors: PropTypes.bool,
    triggerValidator: PropTypes.func,
    unregisterForFormValueChanges: PropTypes.func,
    value: PropTypes.oneOfType([
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

  attributeBindings: ['bunsenId:data-bunsenId'],

  // == Computed Properties ====================================================

  @readOnly
  @computed('formDisabled', 'cellConfig')
  disabled (formDisabled, cellConfig) {
    return formDisabled || get(cellConfig, 'disabled')
  },

  @readOnly
  @computed('renderErrorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  valueClassName (errorMessage) {
    const classNames = []

    if (errorMessage) {
      classNames.push('error')
    }

    return classNames.join(' ')
  },

  @readOnly
  @computed('errorMessage', 'showErrorMessage', 'showAllErrors')
  renderErrorMessage (errorMessage, showErrorMessage, showAllErrors) {
    if (!showAllErrors && !showErrorMessage) {
      return null
    }

    return errorMessage
  },

  @readOnly
  @computed('cellConfig')
  /**
   * Get class name for input wrapper element
   * @param {Object} cellConfig - cell config
   * @returns {String} input wrapper element class name
   */
  inputWrapperClassName (cellConfig) {
    return get(cellConfig || {}, 'classNames.value') || defaultClassNames.inputWrapper
  },

  @readOnly
  @computed('cellConfig')
  /**
   * Get class name for label wrapper element
   * @param {Object} cellConfig - cell config
   * @returns {String} label wrapper element class name
   */
  labelWrapperClassName (cellConfig) {
    return get(cellConfig, 'classNames.label') || defaultClassNames.labelWrapper
  },

  @readOnly
  @computed('cellConfig')
  placeholder (cellConfig) {
    return get(cellConfig, 'placeholder') || ''
  },

  @readOnly
  @computed('bunsenId', 'cellConfig', 'label', 'bunsenModel')
  /**
   * Get current label text for input
   * @param {String} bunsenId - bunsen ID for input (represents path in bunsenModel)
   * @param {BunsenCell} cellConfig - view definition for input
   * @param {String} label - label
   * @param {BunsenModel} bunsenModel - bunsen model
   * @returns {String} label text
   */
  renderLabel (bunsenId, cellConfig, label, bunsenModel) {
    const config = merge(getCellDefaults(), cellConfig)
    const customLabel = label || config.label
    return getLabel(customLabel, bunsenModel, bunsenId)
  },

  @readOnly
  @computed('value', 'cellConfig')
  transformedValue (value, cellConfig) {
    if (typeOf(value) !== 'string') {
      return value
    }

    return this.applyTransforms(value, get(cellConfig, 'transforms.read'))
  },

  @readOnly
  @computed('required', 'value')
  showRequiredLabel (required, value) {
    const valueEmpty = (
      value === undefined ||
      value === null ||
      value === ''
    )

    return required && valueEmpty
  },

  // == Functions ==============================================================

  /**
   * Apply object transform to value
   * @param {Object} value - value to transform
   * @param {Transform} transform - transform to apply
   * @returns {Object} transformed value
   */
  applyObjectTransform (value, transform) {
    const newObject = {}
    const variables = this.getTemplateVariables(value)
    keys(transform.object)
      .forEach((key) => {
        newObject[key] = parseVariables(variables, transform.object[key], '', true)
      })

    return newObject
  },

  /**
   * Apply string transform to value
   * @param {String} value - value to transform
   * @param {Transform} transform - transform to apply
   * @returns {String} transformed value
   */
  applyStringTransform (value, transform) {
    const flags = (transform.global === false ? '' : 'g')

    if (transform.regex) {
      const pattern = new RegExp(transform.from, flags)
      return value.replace(pattern, transform.to)
    }

    return value.split(transform.from).join(transform.to)
  },

  /**
   * Apply transform to value
   * @param {Object|String} value - value to transform
   * @param {Transform} transform - transform to apply
   * @returns {Object|String} transformed value
   */
  applyTransform (value, transform) {
    const isObjectTransform = 'object' in transform
    const isStringTransform = 'from' in transform && 'to' in transform

    if (isObjectTransform) {
      return this.applyObjectTransform(value, transform)
    }

    if (isStringTransform) {
      return this.applyStringTransform(value, transform)
    }

    Logger.warn('Unknown transform:', transform)

    return value
  },

  /**
   * Transform a value based on a set of transforms
   * @param {Object|String} value - value to apply transforms to
   * @param {Array<Transform>} transforms - transforms to apply to value
   * @returns {Object|String} transformed value
   */
  applyTransforms (value, transforms) {
    if (!transforms || transforms.length === 0) {
      return value
    }

    return transforms.reduce(this.applyTransform.bind(this), value)
  },

  /**
   * Get variables for parsing template strings
   * @param {Object} value - value to transform
   * @returns {Object} variables
   */
  getTemplateVariables (value) {
    const id = this.get('bunsenId')
    return {id, value}
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return [
      data.value,
      get(data, 'target.value'),
      data
    ]
      .find((value) => value !== undefined)
  },

  // == Events =================================================================

  didRender () {
    this._super(...arguments)
    Logger.debug('AbstractInput::didRender() called')

    if (this.get('focused')) {
      this.$('input').focus()
    }
  },

  focusSelector () {
    return 'input'
  },

  focusIn (event) {
    if (this.get('onFocus')) {
      const inputSelector = this.focusSelector(event)
      this.get('onFocus')(this.get('bunsenId'), inputSelector)
    }
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event data
     */
    handleChange (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = this.parseValue(e)
      this.getTemplateVariables(newValue)
      const transforms = this.get('cellConfig.transforms.write')
      const transformedNewValue = this.applyTransforms(newValue, transforms)
      const oldValue = this.get('value')

      if (!_.isEqual(transformedNewValue, oldValue)) {
        this.onChange(bunsenId, transformedNewValue)
      }
    },

    /**
     * Stop showing error messages
     */
    hideErrorMessage () {
      if (this.get('showErrorMessage')) {
        this.set('showErrorMessage', false)
      }
    },

    /**
     * Start showing error messages
     */
    showErrorMessage () {
      if (!this.get('showErrorMessage')) {
        this.set('showErrorMessage', true)
      }
    }
  }
})
