/**
 * The select input component
 */
import {utils} from 'bunsen-core'
import Ember from 'ember'
const {A, inject} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

import AbstractInput from './abstract-input'
import * as listUtils from 'ember-frost-bunsen/list-utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-select'
import {getErrorMessage} from 'ember-frost-bunsen/utils'

export default AbstractInput.extend({
  // == Dependencies ===========================================================

  store: inject.service(),

  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  getDefaultProps () {
    return {
      options: A([]),
      optionsInitialized: false,
      queryDisabled: false
    }
  },

  selectedOptions: [],

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenId', 'cellConfig', 'bunsenModel', 'formDisabled', 'queryDisabled')
  disabled (bunsenId, cellConfig, bunsenModel, formDisabled, queryDisabled) {
    if (formDisabled || _.get(cellConfig, 'disabled') || !bunsenModel || queryDisabled) {
      return true
    }

    return false
  },

  @readOnly
  @computed('bunsenModel', 'cellConfig')
  listData (bunsenModel, cellConfig) {
    const enumDef = bunsenModel.items ? bunsenModel.items.enum : bunsenModel.enum
    const renderOptions = _.get(cellConfig, 'renderer.options')
    const hasOverrides = !_.isEmpty(_.get(renderOptions, 'data'))
    const hasNoneOption = _.get(renderOptions, 'none.present')

    let data = []

    if (enumDef && !hasOverrides) {
      data = listUtils.getEnumValues(enumDef)
    } else if (hasOverrides) {
      data = _.cloneDeep(renderOptions.data)
    }

    if (hasNoneOption) {
      const none = _.defaults({
        label: renderOptions.none.label,
        value: renderOptions.none.value
      }, {
        label: 'None',
        value: ''
      })
      data = [none].concat(data)
    }

    return data
  },

  @readOnly
  @computed('cellConfig')
  /**
   * Determine whether or not filtering should be done within frost-select.
   * NOTE: If select is enum driven frost-select will do the filtering unless
   * otherwise specified.
   * @param {Object} cellConfig - cell configuration
   * @returns {Boolean} whether or not filtering is to be done within frost-select
   */
  isFilteringLocally (cellConfig) {
    const modelDef = this._getModelDef()
    return _.get(cellConfig, 'renderer.options.localFiltering') || !modelDef.modelType
  },

  @readOnly
  @computed('options', 'value')
  selectedOptionLabel (options, value) {
    options = options || []
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : value
  },

  @readOnly
  @computed('isFilteringLocally')
  selectOptions (isFilteringLocally) {
    if (isFilteringLocally) {
      return {}
    }

    return {
      onInput: this.actions.filterOptions.bind(this)
    }
  },

  // == Functions ==============================================================

  isQueryDisabled (formValue) {
    const bunsenId = this.get('bunsenId')
    const modelDef = this._getModelDef()
    return modelDef.query !== undefined && !utils.hasValidQueryValues(formValue, modelDef.query, bunsenId)
  },

  _getModelDef () {
    const cellConfig = this.get('cellConfig')
    const modelDef = this.get('bunsenModel')
    const options = _.get(cellConfig, 'renderer.options')

    if (options) {
      return _.assign({}, options, modelDef)
    }

    return modelDef
  },

  /* eslint-disable complexity */
  formValueChanged (newValue) {
    const modelDef = this._getModelDef()
    const oldValue = this.get('formValue')
    this.set('formValue', newValue)

    if (!modelDef) {
      return
    }

    const isQueryDisabled = this.isQueryDisabled(newValue)

    if (this.get('queryDisabled') !== isQueryDisabled) {
      this.set('queryDisabled', isQueryDisabled)
    }

    if (!isQueryDisabled && this.hasQueryChanged(oldValue, newValue, modelDef.query) || this.needsInitialOptions()) {
      // setting required variables once above condition is true
      const store = this.get('store')
      const bunsenId = this.get('bunsenId')
      const listData = this.get('listData')
      // prevent multiple api calls when multiple formValueChanged is fired before options has a chance to be set
      this.set('optionsInitialized', true)
      listUtils.getOptions(newValue, modelDef, listData, bunsenId, store)
        .then((opts) => {
          this.set('options', opts)
        })
        .catch((err) => {
          this.onError(bunsenId, [{
            path: bunsenId,
            message: getErrorMessage(err)
          }])
        })
    }
  },

  hasQueryParams (query) {
    if (!query || _.isEmpty(query)) {
      return false
    }

    const queryString = JSON.stringify(query)
    const parts = queryString.split('${')

    if (parts.length < 2) {
      return false
    }

    return true
  },

  needsInitialOptions () {
    const modelDef = this._getModelDef()
    const optionsInitialized = this.get('optionsInitialized')

    return !optionsInitialized &&
      (!_.isEmpty(this.get('listData')) || !this.hasQueryParams(modelDef.query))
  },

  /* eslint-disable complexity */
  /**
   * Checks if query has been changed
   * @param {Object} oldValue - old formValue
   * @param {Object} newValue - new formValue
   * @param {Object} query - query model
   * @returns {Boolean} true if query has been changed
   */
  hasQueryChanged (oldValue, newValue, query) {
    if (!this.hasQueryParams(query)) {
      return false
    }

    const bunsenId = this.get('bunsenId')
    const queryString = JSON.stringify(query)
    const parts = queryString.split('${')

    const valueVariable = parts[1].split('}')[0]

    // If valueVariable exists in newAttrs & oldAttrs only then evaluate further
    let newValueResult = utils.findValue(newValue, valueVariable, bunsenId)
    let oldValueResult = utils.findValue(oldValue, valueVariable, bunsenId)

    if (newValueResult || oldValueResult) {
      // parse old and new query before look for differences
      const oldQuery = utils.populateQuery(oldValue, query, bunsenId) || {}
      const newQuery = utils.populateQuery(newValue, query, bunsenId) || {}

      // returns false when every top level key/value pair are equal
      return !Object.keys(query)
        .every((key) => {
          return newQuery[key] === oldQuery[key]
        })
    }

    return false
  },
  /* eslint-enable complexity */

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

  // == Actions ================================================================

  actions: {
    /**
     * perform a filter on the widget
     * @param  {String} filter the filter text
     */
    filterOptions (filter) {
      const modelDef = this._getModelDef()
      const bunsenId = this.get('bunsenId')
      const store = this.get('store')
      const value = this.get('formValue')
      const listData = this.get('listData')
      listUtils.getOptions(value, modelDef, listData, bunsenId, store, filter)
        .then((opts) => {
          this.set('options', opts)
        })
        .catch((err) => {
          this.onError(bunsenId, [{
            path: bunsenId,
            message: getErrorMessage(err)
          }])
        })
    }
  }
})
