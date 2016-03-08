import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import {PropTypes} from 'ember-frost-component'
import {getLabel, getInitialValue} from '../components/utils'
import {getCellDefaults} from '../components/validator/defaults'
import {getPath} from '../components/dereference'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Ember.Mixin.create({
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
    'on-change': PropTypes.func.isRequired,
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

  updateValue () {
    const bunsenId = this.get('bunsenId')
    const valuePath = `store.formValue.${bunsenId}`
    const oldValue = this.get('state.value')
    const newValue = this.get(valuePath)

    if (oldValue !== newValue) {
      this.set('state.value', newValue)
    }
  },

  /**
   * Initialze state of input
   */
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

    const onChange = this.get('on-change')

    if (onChange && [undefined, null].indexOf(initialValue) === -1) {
      onChange({
        id: bunsenId,
        value: initialValue
      })
    }

    const valuePath = `store.formValue.${bunsenId}`

    this.addObserver('store.formValue', this.updateValue)
    this.addObserver(valuePath, this.updateValue)
  },

  @readOnly
  @computed('bunsenId', 'state.{hasUserInteracted,value}', 'store.validationResult.errors')
  /**
   * Get current error message for input
   * @param {String} bunsenId - bunsen ID for input (represents path in model)
   * @param {Boolean} hasUserInteracted - whether or not user has interacted with input
   * @param {String} value - current value of input
   * @param {Array<BunsenValidationError|BunsenValidationWarning>} errors - current input validation errors
   * @returns {String} current error message
   */
  errorMessage: function (bunsenId, hasUserInteracted, value, errors) {
    if (!hasUserInteracted || !errors || errors.length === 0) {
      return null
    }

    errors = errors
      .filter((error) => bunsenId === getPath(error.path))

    return _.pluck(errors, 'message').join('\n')
  }
})
