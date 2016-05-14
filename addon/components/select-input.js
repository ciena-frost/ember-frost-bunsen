import AbstractInput from './abstract-input'
import * as listUtils from '../list-utils'
import utils from '../utils'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

export default AbstractInput.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  dbStore: Ember.inject.service('store'),

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  getDefaultProps () {
    return {
      options: Ember.A([])
    }
  },

  selectedOptions: [],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('store.formValue')
  disabled (value) {
    const modelDef = this.get('model')
    const cellConfig = this.get('cellConfig')

    if (cellConfig.disabled || !modelDef) {
      return true
    }

    return !utils.hasValidQueryValues(value, modelDef.query)
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  didReceiveAttrs () {
    this._super(...arguments)
    const modelDef = this.get('model')
    if (!modelDef) {
      return
    }
    const dbStore = this.get('dbStore')
    const value = this.get('store.formValue')
    const bunsenId = this.get('bunsenId')

    if (utils.hasValidQueryValues(value, modelDef.query)) {
      listUtils.getOptions(value, modelDef, bunsenId, dbStore).then((opts) => {
        this.set('options', opts)
      })
    }
  },

  /**
   * Get variables for parsing template strings
   * @param {String} value - value of selected item
   * @returns {Object} variables
   */
  getTemplateVariables (value) {
    let index, label

    const id = this.get('bunsenId')
    const options = this.get('options')

    options.forEach((option, optionIndex) => {
      if (option.value === value) {
        index = optionIndex
        label = option.label
      }
    })

    return {id, index, label, value}
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data[0]
  },

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    /**
     * perform a filter on the widget
     * @param  {String} filter the filter text
     */
    onInput (filter) {
      const modelDef = this.get('model')
      const bunsenId = this.get('bunsenId')
      const dbStore = this.get('dbStore')
      const value = this.get('store.formValue')
      listUtils.getOptions(value, modelDef, bunsenId, dbStore, filter).then((opts) => {
        this.set('options', opts)
      })
    }
  }
})
