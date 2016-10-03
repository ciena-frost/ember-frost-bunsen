import 'bunsen-core/typedefs'

import redux from 'npm:redux'
const {createStore, applyMiddleware} = redux
import thunk from 'npm:redux-thunk'
const thunkMiddleware = thunk.default
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)
import reducer from 'bunsen-core/reducer'
import {validate, changeModel} from 'bunsen-core/actions'

import _ from 'lodash'
import Ember from 'ember'
const {Component, RSVP, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import getOwner from 'ember-getowner-polyfill'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {dereference} from 'bunsen-core/dereference'
import {getDefaultView} from 'bunsen-core/generator'
import validateView, {validateModel} from 'bunsen-core/validator'
import viewV1ToV2 from 'bunsen-core/conversion/view-v1-to-v2'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-detail'

import {deemberify, validateRenderer} from '../utils'

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
  return !_.isEmpty(object) && !_.isPlainObject(object)
}

export default Component.extend(PropTypeMixin, {
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
    onValidation: PropTypes.func,
    registeredComponents: PropTypes.array,
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
      hook: 'bunsenDetail',
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
    if (_.isEmpty(bunsenView)) {
      return getDefaultView(model)
    }

    if (bunsenView.version === '1.0') {
      return viewV1ToV2(bunsenView)
    }

    if (typeOf(bunsenView.get) === 'function' && bunsenView.get('view') === '1.0') {
      return viewV1ToV2(deemberify(bunsenView))
    }

    return _.cloneDeep(bunsenView)
  },

  @readOnly
  @computed('renderView')
  cellTabs () {
    const cells = this.get('renderView.cells')

    // If there is only one cell then we don't need to render tabs
    if (cells.length === 1) {
      return Ember.A([])
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

    return Ember.A(tabs)
  },

  @readOnly
  @computed('cellTabs', 'selectedTabIndex')
  tabSelection (cellTabs, selectedTabIndex) {
    return selectedTabIndex || cellTabs.get('0.id')
  },

  @readOnly
  @computed('propValidationResult')
  isInvalid (propValidationResult) {
    return !_.isEmpty(propValidationResult.errors)
  },

  // == Functions ==============================================================

  /**
   * Keep UI in sync with updates to redux store
   */
  storeUpdated () {
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

      this.get('registeredComponents').forEach((component) => {
        component.formValueChanged(value)
      })
    }

    if (Object.keys(newProps).length === 0) {
      return
    }

    this.setProperties(newProps)

    if ('renderValue' in newProps && this.onChange) {
      this.onChange(value)
    }

    if (('errors' in newProps || 'renderValue' in newProps) && this.onValidation) {
      this.onValidation(validationResult)
    }
  },

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
    this.set('reduxModel', reduxStore.getState().model)
    reduxStore.subscribe(this.storeUpdated.bind(this))
  },

  /**
   * Validate properties
   */
  validateProps () {
    const bunsenModel = this.get('bunsenModel')
    const bunsenModelPojo = isEmberObject(bunsenModel) ? deemberify(bunsenModel) : bunsenModel
    const renderers = this.get('renderers')

    let result = validateModel(bunsenModelPojo)
    this.get('reduxStore').dispatch(changeModel(bunsenModel))
    const view = this.get('renderView')

    if (result.errors.length === 0) {
      const validateRendererFn = validateRenderer.bind(null, getOwner(this))
      result = validateView(view, bunsenModel, _.keys(renderers), validateRendererFn)
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
        validate(null, dispatchValue, this.get('renderModel'), this.get('validators'), RSVP.all)
      )
    } else {
      const newModel = _.get(newAttrs, 'bunsenModel.value')
      const newModelPojo = isEmberObject(newModel) ? deemberify(newModel) : newModel
      const oldModel = _.get(oldAttrs, 'bunsenModel.value')
      const oldModelPojo = isEmberObject(oldModel) ? deemberify(oldModel) : oldModel
      const modelChanged = !_.isEqual(oldModelPojo, newModelPojo)

      if (modelChanged) {
        reduxStore.dispatch(
          validate(null, value, newModelPojo, this.get('validators'), RSVP.all)
        )
      }
    }

    this.validateProps()
  },

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
    },

    /**
     * Register a component for formValue changes
     * @param {Ember.Component} component - the component being registered
     */
    registerComponentForFormValueChanges (component) {
      component.formValueChanged(this.get('renderValue'))
      this.get('registeredComponents').push(component)
    }
  }
})
