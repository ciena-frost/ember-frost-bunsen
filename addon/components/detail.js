import 'ember-frost-bunsen/typedefs'

import redux from 'npm:redux'
const {createStore, applyMiddleware} = redux
import thunk from 'npm:redux-thunk'
const thunkMiddleware = thunk.default
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
import reducer from '../reducer'
import {validate, changeModel} from '../actions'

import _ from 'lodash'
import Ember from 'ember'
const {Component, getOwner} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {dereference} from 'bunsen-core/dereference'
import {getDefaultView} from '../generator'
import validateView, {builtInRenderers, validateModel} from 'bunsen-core/validator'
import {deemberify, recursiveObjectCreate} from '../utils'

/**
 * Determine if an object is an Ember.Object or not
 * @param {Object|Ember.Object} object - object to check
 * @returns {Boolean} whether or not object is an Ember.Object
 */
function isEmberObject (object) {
  return !_.isEmpty(object) && !_.isPlainObject(object)
}

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  propTypes: {
    bunsenModel: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    bunsenView: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
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
      renderers: {},
      showAllErrors: false,
      validators: [],
      value: null
    }
  },

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('renderers')
  allRenderers (renderers) {
    const passedInRenderers = renderers || {}
    return _.assign({}, builtInRenderers, passedInRenderers)
  },

  @readOnly
  @computed('errors')
  renderErrors (errors) {
    return errors || {}
  },

  @readOnly
  @computed('reduxModel')
  renderModel (model) {
    return dereference(model || {}).schema
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
    bunsenView = !_.isEmpty(bunsenView) ? bunsenView : getDefaultView(model)
    return recursiveObjectCreate(bunsenView)
  },

  @readOnly
  @computed('renderView.rootContainers')
  containerTabs (rootContainers) {
    // If there is only one root container then we don't need to render tabs
    if (rootContainers.length === 1) {
      return Ember.A([])
    }

    const tabs = rootContainers.map((container, index) => {
      return {
        alias: container.label,
        id: index
      }
    })

    return Ember.A(tabs)
  },

  @readOnly
  @computed('selectedTabIndex', 'renderView')
  cellConfig (selectedTabIndex) {
    return this.get(`renderView.rootContainers.${selectedTabIndex || 0}`)
  },

  @readOnly
  @computed('allRenderers', 'disabled', 'renderValue', 'renderView', 'showAllErrors')
  /**
   * Get store
   * @param {Object} renderers - renderer to component mapping
   * @param {Boolean} disabled - whether or not entire form should be disabled
   * @param {Object} formValue - current form value
   * @param {BunsenView} view - view being rendered
   * @param {Boolean} showAllErrors - whether or not to show all errors immediately
   * @returns {Object} store
   */
  bunsenStore (renderers, disabled, formValue, view, showAllErrors) {
    return Ember.Object.create({
      disabled,
      formValue,
      renderers,
      showAllErrors,
      view
    })
  },

  @readOnly
  @computed('propValidationResult')
  isInvalid (propValidationResult) {
    return !_.isEmpty(propValidationResult.errors)
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  /**
   * Keep UI in sync with updates to redux store
   */
  storeUpdated () {
    const onChange = this.get('onChange')
    const onValidation = this.get('onValidation')
    const state = this.get('reduxStore').getState()
    const {errors, validationResult, value} = state

    const newProps = {}

    if (!_.isEqual(this.get('errors'), errors)) {
      newProps.errors = errors
    }

    if (!_.isEqual(this.get('reduxModel'), state.model)) {
      newProps.reduxModel = state.model
    }

    if (!_.isEqual(this.get('renderValue'), value)) {
      newProps.renderValue = value
    }

    if (Object.keys(newProps).length === 0) {
      return
    }

    this.setProperties(newProps)

    if ('renderValue' in newProps && onChange) {
      onChange(value)
    }

    if ('errors' in newProps && onValidation) {
      onValidation(validationResult)
    }
  },

  /**
   * Setup redux store
   */
  init () {
    this._super()

    const reduxStore = createStoreWithMiddleware(reducer, {baseModel: this.get('bunsenModel')})

    this.set('reduxStore', reduxStore)
    this.set('reduxModel', reduxStore.getState().model)
    reduxStore.subscribe(this.storeUpdated.bind(this))
  },

  /**
   * Validate properties
   */
  validateProps () {
    const bunsenModel = this.get('bunsenModel')
    const bunsenModelPojo = isEmberObject(bunsenModel) ? deemberify(bunsenModel) : bunsenModel
    const renderers = this.get('allRenderers')

    let result = validateModel(bunsenModelPojo)
    this.get('reduxStore').dispatch(changeModel(bunsenModel))
    const view = this.get('renderView')

    if (result.errors.length === 0) {
      const viewPojo = isEmberObject(view) ? deemberify(view) : view
      result = validateView(viewPojo, bunsenModel, _.keys(renderers), getOwner(this))
    }

    this.set('propValidationResult', result)
  },

  /**
   * Keep value in sync with store and validate properties
   */
  didReceiveAttrs ({newAttrs, oldAttrs}) {
    this._super(...arguments)

    let dispatchValue

    const reduxStore = this.get('reduxStore')
    const value = this.get('value')
    const plainObjectValue = isEmberObject(value) ? deemberify(value) : value
    const reduxStoreValue = reduxStore.getState().value
    const hasUserProvidedValue = [null, undefined].indexOf(plainObjectValue) === -1
    const isReduxStoreValueEmpty = [null, undefined].indexOf(reduxStoreValue) !== -1
    const doesUserValueMatchStoreValue = _.isEqual(plainObjectValue, reduxStoreValue)

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
        validate(null, dispatchValue, this.get('renderModel'), this.get('validators'))
      )
    }

    this.validateProps()
  },

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    onChange () {},

    /**
     * Change selected tab/root container
     * @param {Number} tabIndex - index of root container corresponding to tab
     */
    onTabChange (tabIndex) {
      this.set('selectedTabIndex', tabIndex)
    }
  }
})
