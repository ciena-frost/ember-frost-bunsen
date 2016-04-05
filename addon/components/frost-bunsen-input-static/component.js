import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import {PropTypes} from 'ember-prop-types'
import {getCellDefaults} from '../validator/defaults'
import {getLabel, getInitialValue} from '../utils'
import {getPath} from '../dereference'

import layout from './template'

const PLACEHOLDER = '—'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Ember.Component.extend({
  classNames: [
    'frost-bunsen-input-static',
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
    required: PropTypes.bool,
    reduxStore: PropTypes.object.isRequired,
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

  init () {
    this._super()

    const bunsenId = this.get('bunsenId')

    let initialValue = getInitialValue(
      bunsenId,
      this.get('store.formValue'),
      this.get('initialValue'),
      this.get('model') || {}
    )

    const onChange = this.get('onChange')

    if (onChange && [undefined, null].indexOf(initialValue) === -1) {
      onChange({
        id: bunsenId,
        value: initialValue
      })
    }
  },

  errorMessage: Ember.computed(function () {
    const bunsenId = this.get('bunsenId')
    const errors = this.get('reduxStore').getState().validationResult.errors
    const hasUserInteracted = this.get('state.hasUserInteracted')
    if (!hasUserInteracted || !errors || errors.length === 0) {
      return null
    }

    const myErrors = errors.filter((error) => bunsenId === getPath(error.path))

    return _.pluck(myErrors, 'message').join('\n')
  }),

  /* TODO: Why is this necessary? If it is, use reduxStore.dispatch()
  updateValue () {
    const bunsenId = this.get('bunsenId')
    const valuePath = `store.formValue.${bunsenId}`
    const oldValue = this.get('state.value')
    const newValue = this.get(valuePath)

    if (oldValue !== newValue) {
      this.set('state.value', newValue)
    }
  },
  */

  renderValue: Ember.computed(function () {
    const bunsenId = this.get('bunsenId')
    const placeholder = this.get('cellConfig.placeholder')
    let value = this.get('reduxStore').getState()['value'][bunsenId]
    if (_.isBoolean(value)) {
      value = (value) ? 'true' : 'false'
    } else if (value === '') {
      value = placeholder || PLACEHOLDER
    }
    return value
  })
})
