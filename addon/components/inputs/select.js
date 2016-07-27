import AbstractInput from './abstract-input'
import * as listUtils from '../../list-utils'
import utils from 'bunsen-core/utils'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

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
      options: Ember.A([]),
      initialized: false
    }
  },

  selectedOptions: [],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('bunsenId', 'cellConfig', 'bunsenModel', 'bunsenStore.{disabled,formValue}')
  disabled (bunsenId, cellConfig, bunsenModel, formDisabled, value) {
    if (formDisabled || _.get(cellConfig, 'disabled') || !bunsenModel) {
      return true
    }

    return !utils.hasValidQueryValues(value, bunsenModel.query, bunsenId)
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  didReceiveAttrs ({oldAttrs, newAttrs}) {
    this._super(...arguments)

    const modelDef = this.get('bunsenModel')
    if (!modelDef) {
      return
    }
    if (this.hasQueryChanged(oldAttrs, newAttrs, modelDef.query)) {
      // setting required variables once above condition is true
      const dbStore = this.get('dbStore')
      const value = this.get('bunsenStore.formValue')
      const bunsenId = this.get('bunsenId')
      if (utils.hasValidQueryValues(value, modelDef.query, bunsenId)) {
        listUtils.getOptions(value, modelDef, bunsenId, dbStore).then((opts) => {
          this.set('options', opts)
        })
      }
    }

    this.set('initialized', true)
  },

  /**
   * Checks if query has been changed
   * @param {Object} oldAttrs - old attributes
   * @param {Object} newAttrs - new attributes
   * @param {Object} modelQuery - query model
   * @returns {Boolean} true if query has been changed
   */
  hasQueryChanged (oldAttrs, newAttrs, modelQuery) {
    // allow models that don't have query defined to pass as well as
    // allow the options to get initially populated
    if (!modelQuery || !this.get('initialized')) {
      return true
    }

    var modelQueryHasProperty = false
    for (var prop in modelQuery) {
      if (prop) {
        modelQueryHasProperty = true
      }
    }
      // If modelQuery has properties then evaluate further
    if (modelQueryHasProperty && this.get('initialized')) {
      const bunsenId = this.get('bunsenId')
      const value = _.get(newAttrs, 'bunsenStore.value.formValue')
      const oldValue = _.get(oldAttrs, 'bunsenStore.value.formValue')

      const modelQueryString = JSON.stringify(modelQuery)
      const valueVariable = modelQueryString.split('${')[1].split('}')[0]

        // If valueVariable exists in newAttrs & oldAttrs only then evaluate further
      let valueResult = utils.findValue(value, valueVariable, bunsenId)
      let oldValueResult = utils.findValue(oldValue, valueVariable, bunsenId)
      if (valueResult || oldValueResult) {
        let oldQuery
        let query
              // parse old and new query before look for differences
        try {
          oldQuery = utils.populateQuery(oldValue, modelQuery, bunsenId)
        } catch (e) {
          oldQuery = {}
        }

        try {
          query = utils.populateQuery(value, modelQuery, bunsenId)
        } catch (e) {
          query = {}
        }
               // returns false when every top level key/value pair are equal
        return !Object.keys(modelQuery).every((key) => {
          return query[key] === oldQuery[key]
        })
      }
    } else {
      return false
    }
  },

  /**
   * Get variables for parsing template strings
   * @param {String} value - value of selected item
   * @returns {Object} variables
   */
  getTemplateVariables (value) {
    let index = -1
    let label = ''
    value = value || ''

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
      const modelDef = this.get('bunsenModel')
      const bunsenId = this.get('bunsenId')
      const dbStore = this.get('dbStore')
      const value = this.get('bunsenStore.formValue')
      listUtils.getOptions(value, modelDef, bunsenId, dbStore, filter).then((opts) => {
        this.set('options', opts)
      })
    }
  }
})
