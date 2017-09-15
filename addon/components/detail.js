import {
  actions,
  generateView,
  normalizeView,
  reducer,
  utils,
  validateModel,
  validateView,
  viewV1ToV2
} from 'bunsen-core'

const {
  CHANGE_VALUE,
  change,
  validate
} = actions

const {getSubModel} = utils

import Ember from 'ember'
const {A, Component, Logger, RSVP, getOwner, isEmpty, isPresent, run, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import SpreadMixin from 'ember-spread'
import _ from 'lodash'
import {applyMiddleware, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

import {
  deemberify,
  getMergedConfigRecursive,
  isRegisteredEmberDataModel,
  removeInternalValues,
  validateRenderer
} from '../utils'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-detail'
import {findCommonAncestor, traverseCellBreadthFirst} from 'ember-frost-bunsen/tree-utils'

const {defineProperty, keys} = Object

function getAlias (cell) {
  if (cell.label) {
    return cell.label
  }

  const words = Ember.String.dasherize(cell.model || 'Tab').replace('-', ' ')
  return Ember.String.capitalize(words)
}

/**
 * Determine if an object is an Ember.Object or not
 * @param {Object|Ember.Object} object - object to check
 * @returns {Boolean} whether or not object is an Ember.Object
 */
function isEmberObject (object) {
  return typeOf(object) === 'instance'
}

/**
 * Adds an unenumerable property to an object
 * @param {Object} object - object to add property to
 * @param {String} propName - property name
 * @param {Object|Number|String} value - property value
 */
function addMetaProperty (object, propName, value) {
  defineProperty(object, propName, {
    enumerable: false,
    value
  })
}

/*
 * Convert v1 view to v2 view
 * @param {Object} bunsenView - v1 bunsen view
 * @returns {Object} v2 bunsen view
 */
function v2View (bunsenView) {
  bunsenView = viewV1ToV2(bunsenView)

  if (bunsenView.cells.length === 1) {
    delete bunsenView.cells[0].label
  }

  return bunsenView
}

export default Component.extend(SpreadMixin, HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-detail'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenModel: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    bunsenView: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    focusedInput: PropTypes.string,
    hook: PropTypes.string,
    hookInputDelimiter: PropTypes.string,
    hookPrefix: PropTypes.string,
    mergeDefaults: PropTypes.bool,
    onInputFocusIn: PropTypes.func,
    onInputFocusOut: PropTypes.func,
    onFocusIn: PropTypes.func,
    onFocusOut: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    onTabChange: PropTypes.func,
    onValidation: PropTypes.func,
    plugins: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    registeredComponents: PropTypes.array,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    selectedTabLabel: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.null,
      PropTypes.object
    ])
  },

  getDefaultProps () {
    return {
      batchedChanges: {},
      disabled: false,
      hook: 'bunsenDetail',
      hookInputDelimiter: '-',
      inputValidators: [],
      mergeDefaults: false,
      plugins: {},
      renderers: {},
      registeredComponents: [],
      showAllErrors: false,
      validators: [],
      value: null
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('errors')
  renderErrors (errors) {
    return errors || {}
  },

  @readOnly
  @computed('renderModel', 'view')
  /**
   * Get the view to render (generate one if consumer doesn't supply a view)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @param {BunsenView} view - the view to use (if given)
   * @returns {BunsenView} the view to render
   */
  renderView (model, view) {
    return this.getRenderView(model, view)
  },

  /**
   * Precompute all model dependencies
   * @param {Object[]} cells - the view cells
   * @param {Object} cellDefinitions - the view cell definitions
   * @returns {Object} cellConfigs with  precomputed model dependencies
   */
  @readOnly
  @computed('renderModel', 'view')
  precomputedCells (bunsenModel, view) {
    const {cellDefinitions, cells} = this.getRenderView(bunsenModel, view)
    return cells.map((cell) => {
      const cellConfig = getMergedConfigRecursive(cell, cellDefinitions)

      this.precomputeIds(cellConfig)
      this.precomputeDependencies(cellConfig)

      let subModel = bunsenModel
      if (cell.model) subModel = getSubModel(bunsenModel, cellConfig.model, cellConfig.dependsOn)

      return {
        bunsenModel: subModel,
        cellConfig
      }
    })
  },

  @readOnly
  @computed('precomputedCells')
  cellTabs (cells) {
    // If there is only one cell then we don't need to render tabs
    if (cells.length === 1) {
      return A([])
    }

    const tabs = cells.map(({bunsenModel, cellConfig, isRequired}, index) => {
      const alias = getAlias(cellConfig)

      // Since label is used for tab text don't render a label within tab as well
      delete cellConfig.label

      return {
        alias,
        bunsenModel,
        cell: cellConfig,
        id: `${index}-${Date.now()}`,
        isRequired,
        classNames: Ember.String.dasherize(alias)
      }
    })

    return A(tabs)
  },

  @readOnly
  @computed('cellTabs', 'selectedTabIndex')
  tabSelection (cellTabs, selectedTabIndex) {
    const selectedTab = cellTabs[selectedTabIndex]
    return selectedTab ? selectedTab.id : cellTabs.get('0.id')
  },

  @readOnly
  @computed('propValidationResult')
  isInvalid (propValidationResult) {
    return propValidationResult && !isEmpty(propValidationResult.errors)
  },

  // == Functions ==============================================================

  /* eslint-disable complexity */
  /**
   * Apply updates from redux store
   * @param {String} lastAction - last action that occurred in the redux store
   * @param {Object} newProps - new component property values to apply
   * @param {Object} validationResult - latest validation result
   * @param {Object} value - latest form value
   * @param {Boolean} hasSchemaChanges - whether a schema change has occurred
   */
  applyStoreUpdate ({lastAction, newProps, validationResult, value, hasSchemaChanges}) {
    if (hasSchemaChanges) {
      const model = newProps.renderModel || this.get('renderModel')
      const baseModel = newProps.baseModel || this.get('baseModel')
      const view = newProps.view
        ? this.getRenderView(model, newProps.view)
        : this.getRenderView(model, this.get('view'))
      Object.assign(newProps, this.validateSchemas(baseModel, model, view))
    }

    // batch the property operations and prevent onChange loop for non-async changes
    run.schedule('afterRender', () => {
      // Update component properties with newer state from redux store.
      this.setProperties(newProps)

      // If the value changed inform consumer of the new form value. This occurs
      // when defaults are applied within the redux store.
      if ('renderValue' in newProps) {
        this.informRenderersOfFormValueChange(value)

        if (this.onChange) {
          const valueWithoutInternalState = removeInternalValues(value)
          this.onChange(valueWithoutInternalState)
        }
      }

      // If the last action that occurred in the redux store was validation then
      // inform consumer of latest validation results.
      if (lastAction === 'VALIDATION_RESOLVED' && this.onValidation) {
        this.onValidation(validationResult)
      }

      this.updateSelectedTab()
    })
  },
  /* eslint-enable complexity */

  /**
   * Batches the changes to properties in a single run loop so changes to these props can be compared against
   * the preceeding sync changes. If valueChangeSet is included in the props, special care is taken to merge
   * the changeset rather than overriding it.
   * @param {Object} properties - the properties to merge with the batched version
   * @returns {Object} the newly updated batched properties
   */
  batchChanges (properties) {
    let batchedChanges = this.get('batchedChanges')
    let changeSet = properties.valueChangeSet
    delete properties.valueChangeSet

    Object.assign(batchedChanges, properties)

    if (changeSet) {
      if (!batchedChanges.valueChangeSet) {
        batchedChanges.valueChangeSet = new Map()
      }

      changeSet.forEach((value, key) => {
        batchedChanges.valueChangeSet.set(key, value)
      })
    }

    run.schedule('destroy', () => {
      if (this.isDestroyed || this.isDestroying) return
      this.set('batchedChanges', {})
    })

    return batchedChanges
  },

  /**
   * Get the view to render (generate one if consumer doesn't supply a view)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @param {BunsenView} view - the view to use (if given)
   * @returns {BunsenView} the view to render
   */
  getRenderView (model, view) {
    if (isEmpty(view) || keys(view).length === 0) {
      return generateView(model)
    }

    if (view.version === '1.0') {
      view = v2View(view)
    } else if (typeOf(view.get) === 'function' && view.get('version') === '1.0') {
      view = v2View(deemberify(view))
    } else {
      view = _.cloneDeep(view)
    }

    return normalizeView(view)
  },

  /**
   * Inform renderers that registered to be notified of form value changes of
   * new form value.
   * @param {Object} value - new form value
   */
  informRenderersOfFormValueChange (value) {
    this.get('registeredComponents')
      .forEach((component) => {
        if (component.isDestroyed || component.isDestroying) return
        component.formValueChanged(value)
      })
  },

  /* eslint-disable complexity */
  /**
   * Precompute all model references from the view schema using the references `model` and `dependsOn`
   * @param {Object} cellConfig - the cellConfig to precompute
   * @param {String} [baseBunsenId] - the parent model path
   * Note: Only object types can be precomputed. The array items are more dynamic and we'll denote
   * them with [] in the bunsenIds. That means all array items under the path `model.path.[]` share
   * the same bunsenId.
   */
  precomputeIds (cellConfig, baseBunsenId = 'root') {
    let bunsenId = baseBunsenId

    // support relative model references
    if (cellConfig.model) {
      const nonIndexModel = cellConfig.model.replace(/\.\d+/g, '.[]')
      bunsenId = `${baseBunsenId}.${nonIndexModel}`

      if (cellConfig.dependsOn) {
        const nonIndexDep = cellConfig.dependsOn.replace(/\.\d+/g, '.[]')
        addMetaProperty(cellConfig, '__dependsOn__', bunsenId.replace(nonIndexModel, nonIndexDep))
      }
    }

    if (!cellConfig.children || cellConfig.children.length === 0) {
      // only add bunsenIds to leaf nodes
      addMetaProperty(cellConfig, '__bunsenId__', bunsenId)
    } else if (cellConfig.children) {
      // recursive case for objects
      cellConfig.children.forEach((child) => {
        this.precomputeIds(child, bunsenId)
      })
    }

    // recursive case for arrays
    if (cellConfig.arrayOptions && cellConfig.arrayOptions.itemCell) {
      this.precomputeIds(cellConfig.arrayOptions.itemCell, `${bunsenId}.[]`)
    }
  },

  /**
   * Precomputes the model dependencies or every cell in the view schema
   * @param {Object} cellConfig - the view schema cell
   */
  precomputeDependencies (cellConfig) {
    // determine dependencies from the bottom up (agglomerative)
    traverseCellBreadthFirst(cellConfig, (config) => {
      let deps = []

      // direct __bunsenId__ reference
      if (config.__bunsenId__) {
        deps.push(config.__bunsenId__)
      }

      // direct __dependsOn__ reference
      if (config.__dependsOn__) {
        deps.push(config.__dependsOn__)
      }

      // descendant object dependency reference
      if (config.children) {
        config.children.forEach((child) => {
          if (child.__dependency__) {
            deps.push(child.__dependency__)
          }
        })
      }

      // descendant array dependency references
      if (config.arrayOptions && config.arrayOptions.itemCell) {
        const itemCell = config.arrayOptions.itemCell

        if (itemCell.__dependency__) {
          deps.push(itemCell.__dependency__)
        }
      }

      // determine the common dependency reference
      addMetaProperty(config, '__dependency__', findCommonAncestor(deps))
    })
  },

  /**
   * Keep UI in sync with updates to redux store
   */
  storeUpdated () {
    if (this.isDestroyed || this.isDestroying) return

    const state = this.get('reduxStore').getState()
    const {errors, lastAction, validationResult, value, valueChangeSet} = state
    const hasValueChanges = valueChangeSet ? valueChangeSet.size > 0 : false
    const newProps = {}
    let batchedChanges = this.get('batchedChanges')
    let hasSchemaChanges = false

    if (!_.isEqual(errors, batchedChanges.errors || this.get('errors'))) {
      newProps.errors = errors
    }

    if (!_.isEqual(batchedChanges.renderModel || this.get('renderModel'), state.model)) {
      newProps.renderModel = state.model
      newProps.baseModel = state.baseModel
      hasSchemaChanges = true
    }

    if (!_.isEqual(batchedChanges.view || this.get('view'), state.view)) {
      newProps.view = state.view
      hasSchemaChanges = true
    }

    // we only want CHANGE_VALUE to update the renderValue since VALIDATION_RESULT should
    // not be wired up to change renderValue
    if (hasValueChanges && lastAction === CHANGE_VALUE) {
      newProps.renderValue = value
      newProps.valueChangeSet = valueChangeSet
    }

    batchedChanges = this.batchChanges(newProps)

    if (batchedChanges.valueChangeSet) {
      newProps.valueChangeSet = this.get('batchedChanges.valueChangeSet')
    }
    this.applyStoreUpdate({lastAction, newProps, validationResult, value, hasSchemaChanges})
  },
  /* eslint-enable complexity */

  /**
   * Setup redux store
   */
  init () {
    this._super(...arguments)

    // Create redux store and initialze with starting state
    const reduxStore = createStoreWithMiddleware(reducer, {
      baseModel: {type: 'object'}
    })

    const {baseModel, model: renderModel, view} = reduxStore.getState()
    const {hook, hookPrefix} = this.getProperties(['hook', 'hookPrefix'])

    const props = {
      reduxStore,
      renderModel,
      baseModel,
      view
    }

    if (!isPresent(hookPrefix)) {
      props.hookPrefix = hook
    }

    this.setProperties(props)

    // Subscribe for redux store updates (so we can react to changes)
    reduxStore.subscribe(this.storeUpdated.bind(this))
  },

  /**
   * Validate schemas
   * @param {BunsenModel} baseModel - bunsen model before conditions are evaluated
   * @param {BunsenModel} model - bunsen model
   * @param {BunsenView} view - bunsen view
   * @returns {Object} validation results
   */
  validateSchemas (baseModel, model, view) {
    const props = {
      invalidSchemaType: 'model',
      propValidationResult: validateModel(model, isRegisteredEmberDataModel)
    }

    // If model is valid then lets go ahead and validate the view
    if (props.propValidationResult.errors.length === 0) {
      const renderers = this.get('renderers') || {}
      const validateRendererFn = validateRenderer.bind(null, getOwner(this))

      Object.assign(props, {
        invalidSchemaType: 'view',
        propValidationResult: validateView(
          view,
          baseModel,
          keys(renderers),
          validateRendererFn,
          isRegisteredEmberDataModel
        )
      })
    }

    // Make sure we aren't updating things that haven't actually changed
    Object.keys(props).forEach((key) => {
      if (_.isEqual(props[key], this.get('key'))) {
        delete props[key]
      }
    })

    return props
  },

  /* eslint-disable complexity */
  /**
   * Determines if the any of the schema attrs has changed
   * @param {Object} oldSchema - the old schema
   * @param {Object} newSchema - the new schema
   * @returns {Object} the old and new schemas
   */
  getSchema (oldSchema, newSchema) {
    const oldSchemaPojo = isEmberObject(oldSchema) ? deemberify(oldSchema) : oldSchema
    const newSchemaPojo = isEmberObject(newSchema) ? deemberify(newSchema) : newSchema

    return {
      hasChanged: !_.isEqual(oldSchemaPojo, newSchemaPojo),
      oldSchema: oldSchemaPojo,
      newSchema: newSchemaPojo
    }
  },

  /**
   * Get form and input validators
   * @returns {Function[]} list of validators
   **/
  getAllValidators () {
    const formValidators = this.get('validators') || []
    const inputValidators = this.get('inputValidators')

    return formValidators.concat(inputValidators)
  },

  /**
   * Registers a component validator
   * @param {Ember.Component} component - the component that contains the validate method
   */
  registerValidator (component) {
    if ('validate' in component) {
      const validator = component.validate.bind(component)
      component.on('willDestroyElement', () => {
        this.unregisterValidator(validator)
      })

      this.get('inputValidators').push(validator)
    } else {
      Logger.warn('registerValidator requires the component to implement validate()')
    }
  },

  /**
   * Unregisters a component validator
   * @param {Function} validator - the validator function used when registering
   */
  unregisterValidator (validator) {
    const inputValidators = this.get('inputValidators')
    const index = inputValidators.indexOf(validator)
    if (index >= 0) {
      inputValidators.splice(index, 1)
    }
  },

  /**
   * Update selected tab
   */
  updateSelectedTab () {
    let selectedTabLabel = this.get('selectedTabLabel')
    if (selectedTabLabel === undefined) return

    const selectedTab = this.get('cellTabs').findIndex((item) => item.alias === selectedTabLabel)
    if (selectedTab === undefined) return

    this.set('selectedTabIndex', selectedTab)
  },

  /**
   * Keep value in sync with store and validate properties
   */
  didReceiveAttrs () {
    this._super(...arguments)

    let dispatchValue

    const oldAttrBunsenModel = this.get('_oldAttrBunsenModel')
    const newAttrBunsenModel = this.get('bunsenModel') || this.get('options.bunsenModel')

    const oldAttrBunsenView = this.get('_oldAttrBunsenView')
    const newAttrBunsenView = this.get('bunsenView') || this.get('options.bunsenView')

    const reduxStore = this.get('reduxStore')
    const reduxStoreValue = this.get('renderValue')
    const value = this.get('value')
    const plainObjectValue = isEmberObject(value) ? deemberify(value) : value
    const hasUserProvidedValue = [null, undefined].indexOf(plainObjectValue) === -1
    const isReduxStoreValueEmpty = [null, undefined].indexOf(reduxStoreValue) !== -1
    const {hasChanged: hasModelChanged, newSchema: newBunsenModel} = this.getSchema(oldAttrBunsenModel, newAttrBunsenModel) // eslint-disable-line max-len
    const {hasChanged: hasViewChanged, newSchema: newView} = this.getSchema(oldAttrBunsenView, newAttrBunsenView)
    const allValidators = this.getAllValidators()
    const mergeDefaults = this.get('mergeDefaults')

    // If the store value is empty we need to make sure we we set it to an empty object so
    // properties can be assigned to it via onChange events
    if (isReduxStoreValueEmpty) {
      dispatchValue = {}
    }

    // If the user/consumer has provided a value and it differs from the current store value
    // then we need to update the store to be the user/consumer supplied value
    if (hasUserProvidedValue) {
      if (reduxStoreValue !== null) {
        const reduxStoreValueWithoutInternal = removeInternalValues(reduxStoreValue)
        if (!_.isEqual(plainObjectValue, reduxStoreValueWithoutInternal)) {
          dispatchValue = plainObjectValue
        }
      } else {
        dispatchValue = plainObjectValue
      }
    }

    // If we have a new value to assign the store then let's get to it
    const needsValidation = dispatchValue || (hasModelChanged && newBunsenModel)
    if (needsValidation) {
      reduxStore.dispatch(
        validate(
          null,
          dispatchValue || value,
          hasModelChanged ? newBunsenModel : this.get('renderModel'),
          allValidators,
          RSVP.all,
          undefined,
          mergeDefaults
        ))
    }

    if ((hasViewChanged && newView) || (hasModelChanged && newBunsenModel)) {
      reduxStore.dispatch(change({
        model: hasModelChanged ? newBunsenModel : undefined,
        view: hasViewChanged ? newView : undefined
      }))
    }

    this.set('_oldAttrBunsenModel', newAttrBunsenModel)
    this.set('_oldAttrBunsenView', newAttrBunsenView)
  },
  /* eslint-enable complexity */

  // == Actions ================================================================

  actions: {
    /**
     * Nothing to handle, since value doesn't change for detail component
     */
    handleChange () {},

    /**
     * When a renderer has an error (not a validation issue, but more a logic error)
     * we report it back to the consumer. The main use-case here is API errors
     * for select renderers and custom renderers
     * @param {String} bunsenId - the busnen ID of the component that had an error
     * @param {BunsenValidationError[]} errors - the errors that occurred they're not actually validation errors,
     *                                           but it's a handy format to use for errors
     */
    handleError (bunsenId, errors) {
      if (this.onError) {
        this.onError(bunsenId, errors)
      }
    },

    /**
     * Change selected tab/root cell
     * @param {String} tabId - index of root cell corresponding to tab
     */
    handleTabChange (tabId) {
      const cellTabs = this.get('cellTabs')
      const tabIndex = cellTabs.findIndex((tab) => tab.id === tabId)
      this.set('selectedTabIndex', tabIndex)

      if (this.onTabChange) {
        const selectedTab = cellTabs[tabIndex]

        this.onTabChange(selectedTab.alias)
      }
    },

    /**
     * Register a component for formValue changes
     * @param {Ember.Component} component - the component being registered
     */
    registerComponentForFormValueChanges (component) {
      // Make sure when component is destroyed it unregisters for changes
      component.on('willDestroyElement', () => {
        component.unregisterForFormValueChanges(component)
      })

      // Make sure we inform component of formValue immediately
      component.formValueChanged(this.get('renderValue') || {})

      this.get('registeredComponents').push(component)
    },

    /**
     * Unregister a component for formValue changes
     * @param {Ember.Component} component - the component used to register
     */
    unregisterComponentForFormValueChanges (component) {
      const registeredComponents = this.get('registeredComponents')
      const index = registeredComponents.indexOf(component)

      if (index !== -1) {
        registeredComponents.splice(index, 1)
      }
    },

    /**
     * Returns properties of the top-level form so inputs have easier access to them without requiring
     * those properties be propagated
     * @returns {Object} an object containing common form properties
     */
    getRootProps () {
      const {
        focusedInput,
        hookInputDelimiter,
        lastFocusedInput,
        renderModel,
        renderView
      } = this.getProperties([
        'focusedInput',
        'hookInputDelimiter',
        'lastFocusedInput',
        'renderModel',
        'renderView'
      ])

      const validators = this.getAllValidators()
      const plugins = this.get('plugins')
      return {
        focusedInput,
        lastFocusedInput,
        hookInputDelimiter,
        model: renderModel,
        plugins,
        validators,
        view: renderView
      }
    }
  }
})
