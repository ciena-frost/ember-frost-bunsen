/* global $ */
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
const {A, Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import dereference from '../dereference'
import {getDefaultView} from '../generator'
import {getButtonLabelDefaults} from '../validator/defaults'
import validateView, {validateModel} from '../validator/index'
import {deemberify, recursiveObjectCreate} from '../utils'

const builtinRenderers = {
  PropertyChooser: 'frost-bunsen-property-chooser'
}

export default Component.extend(PropTypeMixin, {
  classNameBindings: ['inline:inline:not-inline'],
  classNames: ['frost-bunsen-form'],

  propTypes: {
    cancelLabel: PropTypes.string,
    inline: PropTypes.bool,
    model: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onValidation: PropTypes.func,
    renderers: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    submitLabel: PropTypes.string,
    validators: PropTypes.array,
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

  @readOnly
  @computed('state.propValidationResult.errors')
  isInvalid (errors) {
    return !_.isEmpty(errors)
  },

  /**
   * Validate the model given as attributes
   */
  validateProps () {
    const model = this.get('model')
    const renderers = this.get('state.renderers') || {}
    const view = this.get('renderView')

    let result = validateModel(this.get('model'))

    if (result.errors.length === 0) {
      result = validateView(view, model, _.keys(renderers))
    }

    this.set('state.propValidationResult', result)
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
      const object = this.get(key)

      if (!_.isEmpty(object) && !_.isPlainObject(object)) {
        this.set(key, deemberify(object))
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

    const passedInRenderers = this.get('renderers') || {}
    const renderers = _.assign({}, builtinRenderers, passedInRenderers)
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

    this.set('state', Ember.Object.create({
      propValidationResult: Ember.Object.create({
        errors: A([]),
        warnings: A([])
      }),
      renderers
    }))

    this.validateProps()
  },

  /**
   * After render select first input
   */
  didRender () {
    // If there is already an element in focus do nothing
    if ($(':focus').length !== 0) {
      return
    }

    // Focus on first input in busen form
    this.$(':input:enabled:visible:first').focus()
  },

  /**
   * Validate model and view when we get updated ones
   */
  didUpdateAttrs () {
    this._super(...arguments)

    const passedInRenderers = this.get('renderers') || {}
    const renderers = _.assign({}, builtinRenderers, passedInRenderers)

    this.validateProps()

    if (!_.isEqual(this.get('state.renderers'), renderers)) {
      this.set('state.renderers', renderers)
    }

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
  @computed('model', 'state.renderers', 'renderView')
  store (model, renderers, view) {
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

  @readOnly
  @computed('onCancel', 'onSumbit')
  hasButtons (onCancel, onSubmit) {
    return !_.isEmpty(onCancel) || !_.isEmpty(onSubmit)
  },

  @readOnly
  @computed('cancelLabel', 'renderView', 'submitLabel')
  buttonLabels (cancelLabel, view, submitLabel) {
    return _.defaults(
      {
        cancel: cancelLabel,
        submit: submitLabel
      },
      view.buttonLabels,
      getButtonLabelDefaults()
    )
  },

  @readOnly
  @computed('model')
  renderModel (model) {
    return dereference(model || {}).schema
  },

  ensureParent (id) {
    // If id does not have a parent the nothing to do
    if (_.isEmpty(id) || id.indexOf('.') === -1) {
      return
    }

    const segments = id.split('.')
    const idLastSegment = segments.pop()
    const formValue = this.get('reduxStore').getState()['value']
    const relativePath = `${segments.join('.')}`

    const relativeObject = _.get(formValue, relativePath)
    const isArrayItem = /^\d+$/.test(idLastSegment)

    if (isArrayItem && !_.isArray(relativeObject)) {
      this.ensureParent(segments.join('.'))
      this.set(relativePath, [])
    } else if (!isArrayItem && !_.isPlainObject(relativeObject)) {
      this.ensureParent(segments.join('.'))
      this.set(relativePath, {})
    }
  },

  actions: {
    /**
     * Handle when user updates form value
     * @param {String} bunsenId - ID of input that changed
     * @param {Object} inputValue - new value for input that changed
     */
    onChange (bunsenId, inputValue) {
      const reduxStore = this.get('reduxStore')
      reduxStore.dispatch(
        validate(bunsenId, inputValue, this.get('renderModel'), this.get('validators'))
      )
    },

    /**
     * Handle when user submits form
     * @param {Event} e - event
     */
    onSubmit (e) {
      e.preventDefault()
      const onSubmit = this.get('onSubmit')

      if (onSubmit) {
        onSubmit(this.get('state.value'))
      }
    }
  }
})
