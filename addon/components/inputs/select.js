/**
 * The select input component
 */
import {utils} from 'bunsen-core'
import Ember from 'ember'
const {A, get, inject, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

import AbstractInput from './abstract-input'
import * as listUtils from 'ember-frost-bunsen/list-utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-select'
import {getErrorMessage} from 'ember-frost-bunsen/utils'

/**
 * Get options for select from both model and view, with view settings taking
 * precendence over model settings.
 * @param {Object} bunsenModel - model for property
 * @param {Object} cellConfig - bunsen view cell for property
 * @returns {Object} merged options from model and view
 */
export function getMergedOptions (bunsenModel, cellConfig) {
  const viewOptions = get(cellConfig, 'renderer.options')

  if (viewOptions) {
    return _.assign({}, bunsenModel, viewOptions)
  }

  return bunsenModel
}

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
      itemsInitialized: false,
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
    const modelDef = getMergedOptions(this.get('bunsenModel'), cellConfig)
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
    const {bunsenId, bunsenModel, cellConfig} = this.getProperties(
      'bunsenId', 'bunsenModel', 'cellConfig'
    )

    const modelDef = getMergedOptions(bunsenModel, cellConfig)
    return modelDef.query !== undefined && !utils.hasValidQueryValues(formValue, modelDef.query, bunsenId)
  },

  /* eslint-disable complexity */
  formValueChanged (newValue) {
    const {
      bunsenModel,
      cellConfig,
      formValue: oldValue
    } = this.getProperties('bunsenModel', 'cellConfig', 'formValue')

    const options = getMergedOptions(bunsenModel, cellConfig)

    this.set('formValue', newValue)

    if (!options) {
      return
    }

    const isQueryDisabled = this.isQueryDisabled(newValue)

    if (this.get('queryDisabled') !== isQueryDisabled) {
      this.set('queryDisabled', isQueryDisabled)
    }

    if (!isQueryDisabled && this.hasQueryChanged(oldValue, newValue, options.query) || this.needsInitialOptions()) {
      // prevent multiple api calls when multiple formValueChanged is fired before options has a chance to be set
      this.set('itemsInitialized', true)
      this.updateItems(newValue)
    }
  },

  /**
   * Determine if query parameters with references to other properties are present
   * @param {Object} query - query parameters as key-value params
   * @returns {Boolean} whether or referential not query parameters are present
   */
  hasQueryParamsWithReferences (query) {
    if (typeOf(query) !== 'object' || Object.keys(query).length === 0) {
      return false
    }

    return Object.keys(query)
      .some((key) => {
        return (
          typeOf(query[key]) === 'string' &&
          query[key].indexOf('${') !== -1
        )
      })
  },

  needsInitialOptions () {
    const {bunsenModel, cellConfig, itemsInitialized} = this.getProperties(
      'bunsenModel', 'cellConfig', 'itemsInitialized'
    )

    const modelDef = getMergedOptions(bunsenModel, cellConfig)

    return !itemsInitialized &&
      (!_.isEmpty(this.get('listData')) || !this.hasQueryParamsWithReferences(modelDef.query))
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
    if (!this.hasQueryParamsWithReferences(query)) {
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

    const {id, options} = this.getProperties('id', 'options')

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

  /**
   * Update select dropdown items
   * @param {Object} value - current form value
   * @param {String} [filter=''] - string to filter items by
   * @returns {RSVP.Promise} resolves once items were fetched (or failed to fetch)
   */
  updateItems (value, filter = '') {
    const {
      bunsenId,
      bunsenModel,
      cellConfig,
      listData: data,
      store
    } = this.getProperties(
      'bunsenId',
      'bunsenModel',
      'cellConfig',
      'listData',
      'store'
    )

    const options = getMergedOptions(bunsenModel, cellConfig)

    return listUtils.getOptions({
      bunsenId,
      data,
      filter,
      options,
      store,
      value
    })
      .then((items) => {
        this.set('options', items)
      })
      .catch((err) => {
        const error = {
          path: bunsenId,
          message: getErrorMessage(err)
        }

        this.onError(bunsenId, [error])
      })
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
      const value = this.get('formValue')
      this.updateItems(value, filter)
    }
  }
})
