import {
  actions,
  generateView,
  normalizeView,
  reducer,
  validateModel,
  validateView,
  viewV1ToV2
} from 'bunsen-core'

const {
  CHANGE_VALUE,
  changeModel,
  validate
} = actions

import Ember from 'ember'
const {A, Component, Logger, RSVP, get, isEmpty, run, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import getOwner from 'ember-getowner-polyfill'
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

function getAttr (attrs, key) {
  attrs = attrs || {}

  return (
    get(attrs, `${key}.value`) ||
    get(attrs, `options.value.${key}`)
  )
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
    hook: PropTypes.string,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    onTabChange: PropTypes.func,
    onValidation: PropTypes.func,
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
      classNames: ['frost-bunsen-detail'],
      disabled: false,
      hook: 'bunsenDetail',
      inputValidators: [],
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
  @computed('renderModel', 'bunsenView')
  /**
   * Get the view to render (generate one if consumer doesn't supply a view)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @param {BunsenView} bunsenView - the view to use (if given)
   * @returns {BunsenView} the view to render
   */
  renderView (model, bunsenView) {
    if (isEmpty(bunsenView) || keys(bunsenView).length === 0) {
      return generateView(model)
    }

    if (bunsenView.version === '1.0') {
      bunsenView = v2View(bunsenView)
    } else if (typeOf(bunsenView.get) === 'function' && bunsenView.get('view') === '1.0') {
      bunsenView = v2View(deemberify(bunsenView))
    } else {
      bunsenView = _.cloneDeep(bunsenView)
    }

    return normalizeView(bunsenView)
  },

  /**
   * Precompute all model dependencies
   * @param {Object[]} cells - the view cells
   * @param {Object} cellDefinitions - the view cell definitions
   * @returns {Object} cellConfigs with  precomputed model dependencies
   */
  @readOnly
  @computed('renderView.cells', 'renderView.cellDefinitions')
  precomputedCellConfig (cells, cellDefinitions) {
    let cellConfigs = cells.map(cell => getMergedConfigRecursive(cell, cellDefinitions))
    cellConfigs.forEach((cellConfig) => {
      this.precomputeIds(cellConfig)
      this.precomputeDependencies(cellConfig)
    })

    return cellConfigs
  },

  @readOnly
  @computed('precomputedCellConfig')
  cellTabs (cells) {
    // If there is only one cell then we don't need to render tabs
    if (cells.length === 1) {
      return A([])
    }

    const tabs = cells.map((cell, index) => {
      const alias = getAlias(cell)

      // Since label is used for tab text don't render a label within tab as well
      delete cell.label

      return {
        alias,
        cell,
        id: `${index}-${Date.now()}`,
        classNames: Ember.String.dasherize(alias)
      }
    })

    return A(tabs)
  },

  @readOnly
  @computed('cellTabs', 'selectedTabIndex')
  tabSelection (cellTabs, selectedTabIndex) {
    const selectedTab = cellTabs.findBy('id', selectedTabIndex)
    return selectedTab ? selectedTabIndex : cellTabs.get('0.id')
  },

  @readOnly
  @computed('propValidationResult')
  isInvalid (propValidationResult) {
    return propValidationResult && !isEmpty(propValidationResult.errors)
  },

  // == Functions ==============================================================

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
   * Batches the changes in a change-set so multiple updates to a change-set
   * don't override each other in a a single run loop
   * @param {Map} changeSet - the changeSet to merge with the batched version
   * @returns {Map} the newly updated batched change-sets
   */
  batchChanges (changeSet) {
    let batchedChangeSet = this.get('batchedChangeSet')

    if (!batchedChangeSet) {
      batchedChangeSet = new Map()

      this.set('batchedChangeSet', batchedChangeSet)
    }

    changeSet.forEach((value, key) => {
      batchedChangeSet.set(key, value)
    })

    run.schedule('afterRender', () => {
      this.set('batchedChangeSet', null)
    })

    return batchedChangeSet
  },

  /**
   * Keep UI in sync with updates to redux store
   */
  storeUpdated () {
    if (this.isDestroyed || this.isDestroying) {
      return
    }

    const state = this.get('reduxStore').getState()
    const {errors, lastAction, validationResult, value, valueChangeSet} = state
    const hasValueChanges = valueChangeSet ? valueChangeSet.size > 0 : false
    const newProps = {}

    if (!_.isEqual(errors, this.get('errors'))) {
      newProps.errors = errors
    }

    if (!_.isEqual(this.get('renderModel'), state.model)) {
      newProps.renderModel = state.model
    }

    // we only want CHANGE_VALUE to update the renderValue since VALIDATION_RESULT should
    // not be wired up to change renderValue
    if (hasValueChanges && lastAction === CHANGE_VALUE) {
      newProps.renderValue = value
      newProps.valueChangeSet = this.batchChanges(valueChangeSet)

      this.get('registeredComponents').forEach((component) => {
        if (!component.isDestroyed && !component.isDestroying) {
          component.formValueChanged(value)
        }
      })
    }

    this.setProperties(newProps)

    if ('renderValue' in newProps && this.onChange) {
      this.onChange(value)
    }

    if (lastAction === "VALIDATION_RESOLVED" && this.onValidation) {
      this.onValidation(validationResult)
    }
  },
  /* eslint-enable complexity */

  /**
   * Setup redux store
   */
  init () {
    this._super(...arguments)

    const value = this.get('value')
    const plainObjectValue = isEmberObject(value) ? deemberify(value) : value
    const reduxStore = createStoreWithMiddleware(reducer, {
      baseModel: this.get('bunsenModel'),
      value: plainObjectValue
    })

    this.set('reduxStore', reduxStore)
    this.set('renderModel', reduxStore.getState().model)
    reduxStore.subscribe(this.storeUpdated.bind(this))
  },

  /**
   * Validate properties
   * @param {Object} bunsenModel - a deemberified bunsenModel
   */
  validateProps (bunsenModel) {
    let invalidSchemaType = 'model'
    const renderers = this.get('renderers') || {}

    let result = validateModel(bunsenModel, isRegisteredEmberDataModel)
    this.get('reduxStore').dispatch(changeModel(bunsenModel))
    const view = this.get('renderView')

    if (result.errors.length === 0) {
      const validateRendererFn = validateRenderer.bind(null, getOwner(this))
      invalidSchemaType = 'view'
      result = validateView(
        view,
        bunsenModel,
        keys(renderers),
        validateRendererFn,
        isRegisteredEmberDataModel
      )
    }

    this.setProperties({
      invalidSchemaType,
      propValidationResult: result
    })
  },

  /* eslint-disable complexity */
  /**
   * Determines if the any of the schema attrs has changed
   * @param {String} schemaName - the name of the schema attribute
   * @param {Object} oldAttrs - the old attributes
   * @param {Object} newAttrs - the new attributes
   * @returns {Object} the old and new schemas
   */
  getSchema (schemaName, oldAttrs, newAttrs) {
    const newSchema = getAttr(newAttrs, schemaName)
    const newSchemaPojo = isEmberObject(newSchema) ? deemberify(newSchema) : newSchema
    const oldSchema = getAttr(oldAttrs, schemaName)
    const oldSchemaPojo = isEmberObject(oldSchema) ? deemberify(oldSchema) : oldSchema

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
   * Keep value in sync with store and validate properties
   */
  didReceiveAttrs ({newAttrs, oldAttrs}) {
    this._super(...arguments)

    let dispatchValue

    const reduxStore = this.get('reduxStore')
    const reduxStoreValue = reduxStore.getState().value
    const value = this.get('value')
    const plainObjectValue = isEmberObject(value) ? deemberify(value) : value
    const hasUserProvidedValue = [null, undefined].indexOf(plainObjectValue) === -1
    const isReduxStoreValueEmpty = [null, undefined].indexOf(reduxStoreValue) !== -1
    const doesUserValueMatchStoreValue = _.isEqual(plainObjectValue, reduxStoreValue)
    const {hasChanged: hasModelChanged, newSchema: newBunsenModel} = this.getSchema('bunsenModel', oldAttrs, newAttrs)
    const {hasChanged: hasViewChanged} = this.getSchema('bunsenView', oldAttrs, newAttrs)
    const allValidators = this.getAllValidators()

    // If the store value is empty we need to make sure we we set it to an empty object so
    // properties can be assigned to it via onChange events
    if (isReduxStoreValueEmpty) {
      dispatchValue = {}
    }

    // If the user/consumer has provided a value and it differs from the current store value
    // then we need to update the store to be the user/consumer supplied value
    if (hasUserProvidedValue && !doesUserValueMatchStoreValue) {
      dispatchValue = plainObjectValue
    }

    // If we have a new value to assign the store then let's get to it
    if (dispatchValue) {
      reduxStore.dispatch(
        validate(null, dispatchValue, this.get('renderModel'), allValidators, RSVP.all)
      )
    } else {
      if (hasModelChanged) {
        reduxStore.dispatch(
          validate(null, value, newBunsenModel, allValidators, RSVP.all)
        )
      }
    }

    if (hasModelChanged || hasViewChanged) {
      this.validateProps(newBunsenModel)
    }

    let selectedTabLabel = this.get('selectedTabLabel')
    if (selectedTabLabel !== undefined) {
      const selectedTab = this.get('cellTabs').findBy('alias', selectedTabLabel)
      if (selectedTab !== undefined) {
        this.set('selectedTabIndex', selectedTab.id)
      }
    }
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
     * @param {Number} tabIndex - index of root cell corresponding to tab
     */
    handleTabChange (tabIndex) {
      this.set('selectedTabIndex', tabIndex)

      if (this.onTabChange) {
        const cellTabs = this.get('cellTabs')
        const selectedTab = cellTabs.findBy('id', tabIndex)

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
    }
  }
})
