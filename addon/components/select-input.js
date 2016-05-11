import _ from 'lodash'
import Input from './abstract-input'
import * as listUtils from '../list-utils'
import * as utils from '../utils'
import Ember from 'ember'

export default Input.extend({
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

  // ==========================================================================
  // Functions
  // ==========================================================================

  didReceiveAttrs () {
    this._super(...arguments)
    let refreshOptions = false
    let value = this.get('value')
    if (!this.get('model')) {
      return
    }
    if (this.checkQueryIsComplete()) {
      this.set('cellConfig.disabled', false)
      if (this.queryHasBeenChanged(...arguments)) {
        // if query has been changed reset value and options
        refreshOptions = true
        value = null
        this.onChange(this.get('bunsenId'), value)
      }
      if (_.isEmpty(this.get('options')) || refreshOptions) {
        this.getOptions()
      }
      this.set('selectedValue', value)
    } else {
      this.set('cellConfig.disabled', true)
    }
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data[0]
  },

  /**
   * Get options for select input based on filter value
   * @param {String} filter the filter text
   */
  getOptions (filter) {
    const modelDef = this.get('model')
    const bunsenId = this.get('bunsenId')
    const dbStore = this.get('dbStore')
    const value = this.get('store.formValue')
    listUtils.getOptions(value, modelDef, bunsenId, dbStore, filter).then((opts) => {
      this.set('options', opts)
    })
  },

  /**
   * Check whether all data this selector depends on is provided
   * @returns {Boolean} true if query is complete, false othervise
   */
  checkQueryIsComplete () {
    const modelDef = this.get('model')
    if (!modelDef.query) {
      return true
    }
    const bunsenId = this.get('bunsenId')
    const value = this.get('store.formValue')
    const query = utils.populateQuery(value, modelDef.query, bunsenId)
    return utils.validateQuery(query, modelDef.query)
  },

  /**
   * Checks whether query for fetching select options has been changed
   * @param {Object} attr - attributes object containing new and old properties passsed to component
   * @returns {Boolean} true if has been changed, false othervise
   */
  queryHasBeenChanged (attr) {
    const modelDef = this.get('model')
    if (!modelDef.query) {
      return false
    }
    const bunsenId = this.get('bunsenId')
    const value = this.get('store.formValue')
    const oldValue = _.get(attr.oldAttrs, 'store.value.formValue')
    const query = utils.populateQuery(value, modelDef.query, bunsenId)
    const oldQuery = utils.populateQuery(oldValue, modelDef.query, bunsenId)
    return utils.queryHasBeenChanged(query, oldQuery, modelDef.query)
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
      this.getOptions(filter)
    }
  }
})
