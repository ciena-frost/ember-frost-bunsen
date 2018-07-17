/**
 * The select input component
 */
import {utils} from 'bunsen-core'
const {ValueWrapper} = utils.path
const {findValue, hasValidQueryValues, parseVariables, populateQuery} = utils
import Ember from 'ember'
const {A, get, inject, isEmpty, isPresent, merge, run, set, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {task} from 'ember-concurrency'
import _ from 'lodash'

import AbstractInput from './abstract-input'
import {getEnumValues, getOptions} from 'ember-frost-bunsen/list-utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-select'
import {getErrorMessage} from 'ember-frost-bunsen/utils'

const {keys} = Object

/**
 * Get options for select from both model and view, with view settings taking
 * precendence over model settings.
 * @param {Object} bunsenModel - model for property
 * @param {Object} cellConfig - bunsen view cell for property
 * @returns {Object} merged options from model and view
 */
export function getMergedOptions (bunsenModel, cellConfig) {
  const viewOptions = get(cellConfig, 'renderer')
  const spreadOptions = get(cellConfig, 'renderer.options')
  let mergedOptions = merge({}, bunsenModel)

  if (viewOptions) {
    mergedOptions = merge(mergedOptions, viewOptions)
  }

  if (spreadOptions) {
    mergedOptions = merge(mergedOptions, spreadOptions)
  }

  return mergedOptions
}

export default AbstractInput.extend({
  // == Dependencies ===========================================================

  ajax: inject.service(),
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
      ignoreEmptyFilterSearch: false,
      waitingOnReferences: false
    }
  },

  selectedOptions: [],

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenId', 'cellConfig', 'bunsenModel', 'formDisabled', 'waitingOnReferences')
  disabled (bunsenId, cellConfig, bunsenModel, formDisabled, waitingOnReferences) {
    if (formDisabled || get(cellConfig, 'disabled') || !bunsenModel || waitingOnReferences) {
      return true
    }

    return false
  },
  @readOnly
  @computed('bunsenModel', 'cellConfig')
  isAsyncGet (bunsenModel, cellConfig) {
    const {endpoint, modelType} = getMergedOptions(bunsenModel, cellConfig)
    return isPresent(modelType) || isPresent(endpoint)
  },
  /* eslint-disable complexity */
  @readOnly
  @computed('bunsenModel', 'cellConfig')
  listData (bunsenModel, cellConfig) {
    const enumDef = bunsenModel.items ? bunsenModel.items.enum : bunsenModel.enum
    const renderOptions = getMergedOptions(bunsenModel, cellConfig)
    const optionsData = get(renderOptions, 'data') || {}
    const hasOverrides = keys(optionsData).length !== 0
    const hasNoneOption = get(renderOptions, 'none.present')

    let data = []

    if (enumDef && !hasOverrides) {
      data = getEnumValues(enumDef)
    } else if (hasOverrides) {
      data = optionsData.map((option) => merge({}, option))
    }

    if (hasNoneOption) {
      data.splice(0, 0, {
        label: renderOptions.none.label || 'None',
        value: renderOptions.none.value || ''
      })
    }

    return data
  },
  /* eslint-enable complexity */

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
    const {endpoint, modelType} = getMergedOptions(this.get('bunsenModel'), cellConfig)
    const dataFromAPI = endpoint || modelType
    return (
      get(cellConfig, 'renderer.localFiltering') ||
      get(cellConfig, 'renderer.options.localFiltering') ||
      !dataFromAPI
    )
  },

  @readOnly
  @computed('options', 'value')
  selectedItemLabel (options, value) {
    options = options || []
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : value
  },

  @readOnly
  @computed('cellConfig', 'isFilteringLocally')
  selectSpreadProperties (cellConfig, isFilteringLocally) {
    const options = {}

    if (!isFilteringLocally) {
      options.onInput = this.actions.filterOptions.bind(this)
    }

    if (typeOf(get(cellConfig, 'renderer.options')) === 'object') {
      const spreadOptions = _.omit(cellConfig.renderer.options, [
        'data',
        'endpoint',
        'labelAttribute',
        'localFiltering',
        'modelType',
        'none',
        'query',
        'queryForCurrentValue',
        'recordsPath',
        'width',
        'valueAttribute'
      ])

      return merge(options, spreadOptions)
    }

    return options
  },

  @readOnly
  @computed('cellConfig')
  width (cellConfig) {
    const renderer = cellConfig.renderer || {}
    return get(renderer, 'width') || undefined
  },

  // == Functions ==============================================================

  /**
   * Determine if query has references to properties that have yet to be set.
   * If the query contains no references then there is nothing to wait on.
   * @param {Object} formValue - form value
   * @returns {Boolean} whether or not query is waiting on missing references
   */
  isWaitingOnReferences (formValue) {
    const {bunsenId, bunsenModel, cellConfig} = this.getProperties(
      'bunsenId', 'bunsenModel', 'cellConfig'
    )

    const {endpoint, query} = getMergedOptions(bunsenModel, cellConfig)

    const isWaitingOnQueryReference = (
      typeOf(query) === 'object' &&
      !hasValidQueryValues(formValue, query, bunsenId)
    )

    if (isWaitingOnQueryReference) {
      return true
    }

    if (!endpoint) {
      return false
    }

    try {
      parseVariables(formValue, endpoint, bunsenId) // throws if reference not met
      return false
    } catch (e) {
      return true
    }
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

    const isWaitingOnReferences = this.isWaitingOnReferences(newValue)

    if (this.get('waitingOnReferences') !== isWaitingOnReferences) {
      this.set('waitingOnReferences', isWaitingOnReferences)
    }

    // If we are still waiting on missing query references or a missing endpoint
    // reference hen there is nothing to do at this point
    if (isWaitingOnReferences) {
      return
    }

    const needsInitialItems = this.needsInitialItems(newValue)
    const hasQueryChanged = this.hasQueryChanged(oldValue, newValue, options.query)
    const hasEndpointChanged = this.hasEndpointChanged(oldValue, newValue, options.endpoint)
    const hasMinedPropertyChanged = this.hasMinedPropertyChanged(oldValue, newValue, options)
    const requiresAsyncChanges = hasQueryChanged || hasEndpointChanged

    if (requiresAsyncChanges || hasMinedPropertyChanged || needsInitialItems) {
      // clears any previous selection
      const clearSelection = get(oldValue || {}, this.get('bunsenId')) !== undefined
      if (!needsInitialItems && requiresAsyncChanges && clearSelection) {
        this.clearOptions()
      }

      // Make sure we flag that we've begun fetching items so we don't queue up
      // a bunch of API requests back to back
      this.set('itemsInitialized', true)
      this.get('updateItems').perform({value: newValue, keepCurrentValue: needsInitialItems})
    }
  },

  clearOptions () {
    const bunsenId = this.get('bunsenId')

    run.next(() => {
      if (this.isDestroying || this.isDestroyed) return

      this.onChange(bunsenId, undefined)
      this.set('options', [])
    })
  },

  /**
   * Determine if endpoint contains references to other properties
   * @param {String} endpoint - endpoint
   * @returns {Boolean} whether or not referential endpoint is present
   */
  hasEndpointWithReferences (endpoint) {
    if (typeOf(endpoint) !== 'string') return false
    return endpoint.indexOf('${') !== -1
  },

  /**
   * Determine if query parameters with references to other properties are present
   * @param {Object} query - query parameters as key-value params
   * @returns {Boolean} whether or not referential query parameters are present
   */
  hasQueryParamsWithReferences (query) {
    if (typeOf(query) !== 'object' || keys(query).length === 0) {
      return false
    }

    return keys(query)
      .some((key) => {
        return (
          typeOf(query[key]) === 'string' &&
          query[key].indexOf('${') !== -1
        )
      })
  },

  needsInitialItems (formValue) {
    const {bunsenModel, cellConfig, itemsInitialized} = this.getProperties(
      'bunsenModel', 'cellConfig', 'itemsInitialized'
    )

    const {endpoint, query} = getMergedOptions(bunsenModel, cellConfig)

    // If items have already been initialized then we are done here
    if (itemsInitialized) return false

    // If there is hardcoded data then we need to initialize so at a minimum
    // the hardcoded data shows up immediately
    if (!isEmpty(this.get('listData'))) return true

    const bunsenId = this.get('bunsenId')
    const queryHasReferences = hasValidQueryValues(formValue, query, bunsenId)

    // If endpoint and query contain no references or references are all present
    // then we are ready to initialize
    if (endpoint) {
      let endpointHasReferences

      try {
        parseVariables(formValue, endpoint, bunsenId)
        endpointHasReferences = true
      } catch (e) {
        endpointHasReferences = false
      }

      return endpointHasReferences && queryHasReferences
    }

    // If using modelType and query contains no references or references are all
    // present then we can go ahead and initialize items
    return queryHasReferences
  },

  /**
   * Checks if endpoint has been changed
   * @param {Object} oldValue - old formValue
   * @param {Object} newValue - new formValue
   * @param {String} endpoint - endpoint
   * @returns {Boolean} true if endpoint has changed
   */
  hasEndpointChanged (oldValue, newValue, endpoint) {
    if (!this.hasEndpointWithReferences(endpoint)) {
      return false
    }

    const bunsenId = this.get('bunsenId')
    const parts = endpoint.split('${')

    const valueVariable = parts[1].split('}')[0]

    // If valueVariable exists in newAttrs & oldAttrs only then evaluate further
    let newValueResult = findValue(newValue, valueVariable, bunsenId)
    let oldValueResult = findValue(oldValue, valueVariable, bunsenId)

    // If no new or old value results then nothing to compare
    if (!newValueResult && !oldValueResult) {
      return false
    }

    let newEndpoint, oldEndpoint

    try {
      newEndpoint = parseVariables(newValue, endpoint, bunsenId) // throws if reference not met
    } catch (e) {
      newEndpoint = ''
    }

    try {
      oldEndpoint = parseVariables(oldValue, endpoint, bunsenId) // throws if reference not met
    } catch (e) {
      oldEndpoint = ''
    }

    return oldEndpoint !== newEndpoint
  },

  /**
   * Checks if mined property has changed
   * @param {Object} oldValue - old formValue
   * @param {Object} newValue - new formValue
   * @param {Object} options - options
   * @returns {Boolean} true if mined property has changed
   */
  hasMinedPropertyChanged (oldValue, newValue, {recordsPath, endpoint}) {
    if (!recordsPath) return false // if not mining local property
    if (endpoint) return false // if endpoint is present mining isn't local

    let newMinedProperty
    let oldMinedProperty

    if (recordsPath[0] === '.') {
      oldMinedProperty = new ValueWrapper(oldValue || {}, this.get('bunsenId')).get(recordsPath)
      newMinedProperty = new ValueWrapper(newValue || {}, this.get('bunsenId')).get(recordsPath)
    } else {
      oldMinedProperty = new ValueWrapper(oldValue || {}, recordsPath).get()
      newMinedProperty = new ValueWrapper(newValue || {}, recordsPath).get()
    }

    if (_.isEqual(oldMinedProperty, newMinedProperty)) return false // if mined property hasn't changed

    return true
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
    let newValueResult = findValue(newValue, valueVariable, bunsenId)
    let oldValueResult = findValue(oldValue, valueVariable, bunsenId)

    // If no new or old value results then nothing to compare
    if (!newValueResult && !oldValueResult) {
      return false
    }

    // parse old and new query before look for differences
    const oldQuery = populateQuery(oldValue, query, bunsenId) || {}
    const newQuery = populateQuery(newValue, query, bunsenId) || {}

    // returns false when every top level key/value pair are equal
    return !keys(query)
      .every((key) => {
        return newQuery[key] === oldQuery[key]
      })
  },
  /* eslint-enable complexity */

  /**
   * Get variables for parsing template strings
   * @param {String} value - value of selected item
   * @returns {Object} variables
   */
  getTemplateVariables (value) {
    const {id, options} = this.getProperties('id', 'options')

    return options.reduce(
      (vars, option, index) => {
        if (option.value === value) {
          vars.index = index
          vars.label = option.label
        }

        return vars
      },
      {
        id,
        index: -1,
        label: '',
        value: ''
      }
    )
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data[0]
  },
  /* eslint-disable complexity */
  /**
   * Restartable ember-concurrency task that updates select dropdown items
   * @param {Object} value - current form value
   * @param {String} [filter=''] - string to filter items by
   * @param {Boolean} keepCurrentValue - determines whether we need to refetch for the current value
   */
  updateItems: task(function * ({value, filter = '', keepCurrentValue}) {
    const {
      ajax,
      bunsenId,
      bunsenModel,
      cellConfig,
      listData: data,
      store,
      value: currentValue
    } = this.getProperties(
      'ajax',
      'bunsenId',
      'bunsenModel',
      'cellConfig',
      'listData',
      'store',
      'value'
    )
    let onlyQueryForCurrentValue = false
    if (this.ignoreEmptyFilterSearch && isEmpty(filter)) {
      if (isEmpty(currentValue)) {
        // sets options back to it's original data. This should usually be empty unless using static data.
        return this.set('options', data)
      } else {
      // Autocomplete has empty filter, and current value. So should only query for current value
        onlyQueryForCurrentValue = true
      }
    }

    const options = getMergedOptions(bunsenModel, cellConfig)

    if (options.endpoint) {
      const endpoint = parseVariables(
        this.get('formValue'),
        options.endpoint,
        bunsenId
      )

      set(options, 'endpoint', endpoint)
    }

    try {
      const items = yield getOptions({
        ajax,
        bunsenId,
        data,
        filter,
        options,
        store,
        value,
        keepCurrentValue,
        onlyQueryForCurrentValue
      })
      this.set('options', items)
    } catch (err) {
      const error = {
        path: bunsenId,
        message: getErrorMessage(err)
      }
      this.onError(bunsenId, [error])
    }
  }).restartable(),
  /* eslint-enable complexity */

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
      this.get('updateItems').perform({value, filter, keepCurrentValue: false})
    }
  }
})
