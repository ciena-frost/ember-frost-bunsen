import AbstractInput from './abstract-input'
import * as listUtils from '../../list-utils'
import utils from 'bunsen-core/utils'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-select'

export default AbstractInput.extend({
  // == Dependencies ===========================================================

  dbStore: Ember.inject.service('store'),

  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  getDefaultProps () {
    return {
      options: Ember.A([]),
      initialized: false
    }
  },

  selectedOptions: [],

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenId', 'cellConfig', 'bunsenModel', 'formDisabled', 'formValue')
  disabled (bunsenId, cellConfig, bunsenModel, formDisabled, value) {
    if (formDisabled || _.get(cellConfig, 'disabled') || !bunsenModel) {
      return true
    }

    const query = bunsenModel.query || _.get(cellConfig, 'renderer.options.query')

    return !utils.hasValidQueryValues(value, query, bunsenId)
  },

  // == Functions ==============================================================

  _getModelDef () {
    const cellConfig = this.get('cellConfig')
    const modelDef = this.get('bunsenModel')
    const options = _.get(cellConfig, 'renderer.options')

    if (options) {
      return _.assign(options, modelDef)
    }

    return modelDef
  },

  formValueChanged (newValue) {
    const modelDef = this._getModelDef()
    const oldValue = this.get('formValue')

    this.set('formValue', newValue)

    if (!modelDef) {
      return
    }

    if (this.hasQueryChanged(oldValue, newValue, modelDef.query)) {
      // setting required variables once above condition is true
      const dbStore = this.get('dbStore')
      const bunsenId = this.get('bunsenId')
      if (utils.hasValidQueryValues(newValue, modelDef.query, bunsenId)) {
        listUtils.getOptions(newValue, modelDef, bunsenId, dbStore).then((opts) => {
          this.set('options', opts)
        })
      }
    }
  },

  /**
   * Checks if query has been changed
   * @param {Object} oldValue - old formValue
   * @param {Object} newValue - new formValue
   * @param {Object} query - query model
   * @returns {Boolean} true if query has been changed
   */
  hasQueryChanged (oldValue, newValue, query) {
    // allow models that don't have query defined to pass as well as
    // allow the options to get initially populated
    if (!query || !this.get('initialized')) {
      return true
    }

    var queryHasProperty = false

    for (var prop in query) {
      if (prop) {
        queryHasProperty = true
      }
    }

    if (!queryHasProperty || !this.get('initialized')) {
      return false
    }

    const bunsenId = this.get('bunsenId')
    const queryString = JSON.stringify(query)
    const parts = queryString.split('${')

    if (parts.length < 2) {
      return false
    }

    const valueVariable = parts[1].split('}')[0]

    // If valueVariable exists in newAttrs & oldAttrs only then evaluate further
    let newValueResult = utils.findValue(newValue, valueVariable, bunsenId)
    let oldValueResult = utils.findValue(oldValue, valueVariable, bunsenId)

    if (newValueResult || oldValueResult) {
      let oldQuery
      let newQuery

      // parse old and new query before look for differences
      try {
        oldQuery = utils.populateQuery(oldValue, query, bunsenId)
      } catch (e) {
        oldQuery = {}
      }

      try {
        newQuery = utils.populateQuery(newValue, query, bunsenId)
      } catch (e) {
        newQuery = {}
      }
             // returns false when every top level key/value pair are equal
      return !Object.keys(query)
        .every((key) => {
          return newQuery[key] === oldQuery[key]
        })
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

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  },

  didReceiveAttrs ({oldAttrs, newAttrs}) {
    this._super(...arguments)
    this.set('initialized', true)
  },

  // == Actions ================================================================

  actions: {
    /**
     * perform a filter on the widget
     * @param  {String} filter the filter text
     */
    onInput (filter) {
      const modelDef = this._getModelDef()
      const bunsenId = this.get('bunsenId')
      const dbStore = this.get('dbStore')
      const value = this.get('bunsenStore.formValue')
      listUtils.getOptions(value, modelDef, bunsenId, dbStore, filter).then((opts) => {
        this.set('options', opts)
      })
    }
  }
})
