import 'ember-frost-bunsen/typedefs'

import redux from 'npm:redux'
const {createStore, applyMiddleware} = redux
import thunk from 'npm:redux-thunk'
const thunkMiddleware = thunk.default
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
import reducer from '../reducer'
import {validate} from '../actions'

import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import dereference from '../dereference'
import {getDefaultView} from '../generator'
import validateView, {validateModel} from '../validator/index'
import {deemberify, recursiveObjectCreate} from '../utils'

/**
 * Determine if an object is an Ember.Object or not
 * @param {Object|Ember.Object} object - object to check
 * @returns {Boolean} whether or not object is an Ember.Object
 */
function isEmberObject (object) {
  return !_.isEmpty(object) && !_.isPlainObject(object)
}

const builtInRenderers = {
  PropertyChooser: 'frost-bunsen-property-chooser'
}

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  propTypes: {
    model: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    renderers: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    value: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.null,
      PropTypes.object
    ]),
    view: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ])
  },

  getDefaultProps () {
    return {
      classNames: ['frost-bunsen-detail'],
      renderers: {},
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
  @computed('model')
  renderModel (model) {
    return dereference(model || {}).schema
  },

  @readOnly
  @computed('model', 'view')
  /**
   * Get the view to render (generate one if consumer doesn't supply a view)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @param {BunsenView} view - the view to use (if given)
   * @returns {BunsenView} the view to render
   */
  renderView (model, view) {
    view = !_.isEmpty(view) ? view : getDefaultView(model)
    return isEmberObject(view) ? view : recursiveObjectCreate(view)
  },

  @readOnly
  @computed('renderView')
  cellConfig () {
    return this.get('renderView.rootContainers.0')
  },

  @readOnly
  @computed('allRenderers', 'renderView')
  /**
   * Get store
   * @param {Object} renderers - renderer to component mapping
   * @param {BunsenView} view - view being rendered
   * @returns {Object} store
   */
  store (renderers, view) {
    return Ember.Object.create({
      formValue: this.get('reduxStore').getState().value,
      renderers,
      view
    })
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

    this.setProperties({
      errors,
      renderValue: value || {}
    })

    if (onChange) {
      onChange(value)
    }

    if (onValidation) {
      onValidation(validationResult)
    }
  },

  /**
   * Setup redux store
   */
  init () {
    this._super()

    const reduxStore = createStoreWithMiddleware(reducer)

    this.set('reduxStore', reduxStore)
    reduxStore.subscribe(this.storeUpdated.bind(this))
  },

  /**
   * Validate properties
   */
  validateProps () {
    const model = this.get('model')
    const modelPojo = isEmberObject(model) ? deemberify(model) : model
    const renderers = this.get('allRenderers')
    const view = this.get('renderView')

    let result = validateModel(modelPojo)

    if (result.errors.length === 0) {
      const viewPojo = isEmberObject(view) ? deemberify(view) : view
      result = validateView(viewPojo, model, _.keys(renderers))
    }

    this.set('propValidationResult', result)
  },

  /**
   * Keep value in sync with store and validate properties
   */
  didReceiveAttrs () {
    this._super(...arguments)

    const reduxStore = this.get('reduxStore')
    const value = this.get('value')
    const pojoValue = isEmberObject(value) ? deemberify(value) : value
    const hasValueChanged = !_.isEqual(pojoValue, reduxStore.getState().value)

    if (hasValueChanged) {
      reduxStore.dispatch(
        validate(null, pojoValue || {}, this.get('renderModel'), this.get('validators'))
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
    onChange () {}
  }
})
