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
const {A, Component, Logger} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import dereference from '../dereference'
import {getDefaultView} from '../generator'
import validateView, {validateModel, validateValue} from '../validator/index'
import {deemberify, recursiveObjectCreate} from '../utils'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-detail', 'inline'],

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
      renderers: {},
      validators: []
    }
  },

  /**
   * Get the view (from props or from generator)
   *
   * @param {BunsenView} view - the view to use (if given)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @returns {BunsenView} the view
   */
  getView (view, model) {
    if (!_.isEmpty(view)) {
      return view
    }

    return getDefaultView(model)
  },

  @readOnly
  @computed('model', 'view')
  renderView (model, view) {
    return recursiveObjectCreate(
      this.getView(view, model)
    )
  },

  /**
   * Validate the model given as attributes
   */
  validateProps () {
    const model = this.get('model')
    const renderers = this.get('state.renderers') || {}
    const value = this.get('value')
    const view = this.get('renderView')

    let result = validateModel(model)

    if (result.errors.length === 0) {
      result = validateView(view, model, _.keys(renderers))
    }

    if (result.errors.length === 0 && value) {
      result = validateValue(value, model, false)
    }

    if (_.isArray(result.errors) && result.errors.length) {
      Logger.log('-BUNSEN ERRORS------------------------')
      Logger.log('   `----.                ')
      Logger.log('   :::::::.              ')
      Logger.log(' `::O::::::-`            ')
      Logger.log(' -:::::::::::.           ')
      Logger.log(' `--:-. ::::::-`     ..  ')
      Logger.log('       .::::::::-..`.::  ')
      Logger.log('       .:::::::::::::-`  ')
      Logger.log('       -:::::::::::-`    ')
      Logger.log('        .:-``-::.        ')
      Logger.log('       `..  `...         ')
      for (let error of result.errors) {
        Logger.warn(`${error.message} (${error.path})`)
      }
      Logger.log('--------------------------------------')
    }
  },

  /**
   * Ensure we are working with POJO's
   */
  fixPropTypes () {
    ;[
      'model',
      'renderers',
      'value',
      'view'
    ].forEach((key) => {
      let object = this.get(key)

      if (!_.isEmpty(object) && !_.isPlainObject(object)) {
        object = deemberify(object)
        this.set(key, object)
      }
    })
  },

  storeUpdated () {
    const onChange = this.get('onChange')
    const onValidation = this.get('onValidation')
    const state = this.get('reduxStore').getState()
    const {errors, validationResult, value} = state

    this.setProperties({
      errors,
      value
    })

    if (onChange) {
      onChange(value)
    }

    if (onValidation) {
      onValidation(validationResult)
    }
  },

  /**
   * Validate model and view when we first get them
   */
  init () {
    this._super()

    this.fixPropTypes()

    const reduxStore = createStoreWithMiddleware(reducer)

    this.setProperties({
      errors: {},
      reduxStore
    })

    reduxStore.subscribe(this.storeUpdated.bind(this))

    const value = this.get('value') || {}

    reduxStore.dispatch(
      validate(null, value, this.get('renderModel'), this.get('validators'))
    )

    const passedInRenderers = this.get('renderers')
    const renderers = _.assign({}, passedInRenderers)
    this.set('state', Ember.Object.create({
      propValidationResult: {
        errors: A([]),
        warnings: A([])
      },
      renderers
    }))

    this.fixPropTypes()
    this.validateProps()
  },

  /**
   * Validate model and view when we get updated ones
   * @param {Object} attrs - A hash of the old attributes and the new attributes
   */
  didUpdateAttrs () {
    this._super(...arguments)
    // const passedInRenderers = this.get('renderers') || {}
    // const renderers = _.assign({}, builtinRenderers, passedInRenderers)

    this.validateProps()
    // if (!_.isEqual(this.get('state.renderers'), renderers)) {
    //   this.set('state.renderers', renderers)
    // }

    const reduxStore = this.get('reduxStore')
    const value = this.get('value')

    if (value === undefined) {
      this.set('value', reduxStore.getState().value)
      return
    }

    if (_.isEqual(value, reduxStore.getState().value)) {
      return
    }

    reduxStore.dispatch(
      validate(null, value, this.get('renderModel'), this.get('validators'))
    )
  },

  willUpdate () {
    this.fixPropTypes()
  },

  @readOnly
  @computed('model')
  renderModel (model) {
    return dereference(model || {}).schema
  },

  @readOnly
  @computed('state.renderers', 'renderView')
  store (renderers, view) {
    return Ember.Object.create({
      renderers,
      view
    })
  },

  @readOnly
  @computed('renderView')
  cellConfig () {
    return this.get('renderView.rootContainers.0')
  },

  actions: {
    onChange () {
      //
    }
  }
})
