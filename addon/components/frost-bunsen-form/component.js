/* global $ */
import 'ember-frost-bunsen/typedefs'

import redux from 'npm:redux'
const {createStore} = redux

import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import reducer from '../../reducer'

import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'
import dereference from '../dereference'
import {getDefaultView} from '../generator'
import {getButtonLabelDefaults} from '../validator/defaults'
import validateView, {validateModel, validateValue} from '../validator/index'
import {aggregateResults} from '../validator/utils'
import {deemberify, recursiveObjectCreate} from '../utils'

const builtinRenderers = {
  PropertyChooser: 'frost-bunsen-property-chooser'
}

export default Ember.Component.extend(PropTypeMixin, {
  classNameBindings: ['inline:inline:not-inline'],
  classNames: ['frost-bunsen-form'],

  layout,

  propTypes: {
    cancelLabel: PropTypes.string,
    initialValue: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
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
    view: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ])
  },

  // Defaults
  initialValue: {},
  renderers: {},
  validators: [],

  /**
   * Get the view (from props or from generator)
   *
   * @param {BunsenView} view - the view to use (if given)
   * @param {BunsenModel} model - the model schema to use to generate a view (if view is undefined)
   * @returns {BunsenView} the view
   */
  getView: function (view, model) {
    if (!_.isEmpty(view)) {
      return view
    }

    return getDefaultView(model)
  },

  @readOnly
  @computed('model', 'view')
  renderView: function (model, view) {
    return recursiveObjectCreate(
      this.getView(view, model)
    )
  },

  /**
   * Validate the model given as attributes
   */
  validateProps: function () {
    const model = this.get('model')
    const renderers = this.get('state.renderers') || {}
    const view = this.get('renderView')

    let result = validateModel(this.get('model'))

    if (result.valid) {
      result = validateView(view, model, _.keys(renderers))
    }

    this.set('state.propValidationResult', result)
  },

  /**
   * Ensure we are working with POJO's
   */
  fixPropTypes: function () {
    ;[
      'initialValue',
      'model',
      'renderers',
      'view'
    ].forEach((key) => {
      const object = this.get(key)

      if (!_.isEmpty(object) && !_.isPlainObject(object)) {
        this.set(key, deemberify(object))
      }
    })
  },

  /**
   * Validate model and view when we first get them
   */
  init: function () {
    this._super()

    this.fixPropTypes()

    const passedInRenderers = this.get('renderers') || {}
    const renderers = _.assign({}, builtinRenderers, passedInRenderers)

    this.set('reduxStore', createStore(reducer))

    this.set('state', Ember.Object.create({
      propValidationResult: Ember.Object.create({
        valid: false,
        errors: Ember.A([]),
        warnings: Ember.A([])
      }),
      validationResult: Ember.Object.create({
        valid: false,
        errors: Ember.A([]),
        warnings: Ember.A([])
      }),
      renderers,
      value: this.get('initialValue')
    }))

    this.validateProps()

    // validate the initial value that was passed in
    if (this.get('initialValue')) {
      this.validate()
    }
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
  didUpdateAttrs: function () {
    const passedInRenderers = this.get('renderers') || {}
    const renderers = _.assign({}, builtinRenderers, passedInRenderers)
    this.validateProps()

    if (!_.isEqual(this.get('state.renderers'), renderers)) {
      this.set('state.renderers', renderers)
    }
  },

  willUpdate: function () {
    this.fixPropTypes()
  },

  /**
   * validate the current value of the form against the schema
   */
  validate: function () {
    const result = validateValue(this.get('state.value'), this.get('renderModel'))

    const promises = []
    this.get('validators').forEach((validator) => {
      promises.push(validator(this.get('state.value')))
    })

    Promise.all(promises)
      .then((snapshots) => {
        const results = _.pluck(snapshots, 'value')
        results.push(result)

        const aggregatedResult = aggregateResults(results)
        // TODO: Dispatch an err action
        // this.set('state.validationResult', aggregatedResult)
        const onValidation = this.get('onValidation')

        if (onValidation) {
          onValidation(aggregatedResult)
        }
      })
  },

  @readOnly
  @computed('model', 'state.{renderers}', 'renderView')
  store: function (model, renderers, view) {
    return Ember.Object.create({
      renderers,
      view
    })
  },

  @readOnly
  @computed('renderView')
  cellConfig: function () {
    return this.get('renderView.rootContainers.0')
  },

  @readOnly
  @computed('onCancel', 'onSumbit')
  hasButtons: function (onCancel, onSubmit) {
    return !_.isEmpty(onCancel) || !_.isEmpty(onSubmit)
  },

  /* TODO
  @readOnly
  @computed('state.validationResult.valid')
  isSubmitBtnDisabled: function (valid) {
    return !valid
  },
 */

  @readOnly
  @computed('cancelLabel', 'renderView', 'submitLabel')
  buttonLabels: function (cancelLabel, view, submitLabel) {
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
  renderModel: function (model) {
    return dereference(model || {}).schema
  },

  ensureParent: function (id) {
    // If id does not have a parent the nothing to do
    if (_.isEmpty(id) || id.indexOf('.') === -1) {
      return
    }

    const segments = id.split('.')
    const idLastSegment = segments.pop()
    const relativePath = `state.value.${segments.join('.')}`

    const relativeObject = this.get(relativePath)
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
     * @param {BunsneChangeEvent} e - change event
     */
    onChange (e) {
      const id = e.id
      const key = `state.value.${id}`

      if (e.value === '' || (_.isArray(e.value) && e.value.length === 0)) {
        const segments = key.split('.')
        const removeKey = segments.pop()
        const parentKey = segments.join('.')
        const parentObject = this.get(parentKey)

        if (!parentObject) {
          return
        }

        delete parentObject[removeKey]
        this.notifyPropertyChange(parentKey)
      } else {
        this.ensureParent(id)
        const newValue = e.value
        const oldValue = this.get(key)

        if (newValue === oldValue) {
          return
        }

        this.set(key, newValue)
      }

      this.validate()

      const value = this.get('state.value')
      const onChange = this.get('onChange')

      if (onChange) {
        onChange(value)
      }
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
