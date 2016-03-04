import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'
import dereference from '../dereference'
import {getDefaultView} from '../generator'
import validateView, {validateModel, validateValue} from '../validator/index'
import {deemberify, recursiveObjectCreate} from '../utils'

export default Ember.Component.extend(PropTypesMixin, {
  classNames: ['frost-bunsen-detail', 'inline'],

  layout,

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
      PropTypes.object
    ]),
    view: PropTypes.oneOf([
      PropTypes.EmberObject,
      PropTypes.object
    ])
  },

  // Defaults
  renderers: {},

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
  @computed('state.model', 'state.view')
  renderView: function (model, view) {
    return recursiveObjectCreate(
      this.getView(view, model)
    )
  },

  /**
   * Validate the model given as attributes
   */
  validateProps: function () {
    const model = this.get('state.model')
    const renderers = this.get('state.renderers') || {}
    const value = this.get('state.value')
    const view = this.get('renderView')

    let result = validateModel(model)

    if (result.valid) {
      result = validateView(view, model, _.keys(renderers))
    }

    if (result.valid && value) {
      result = validateValue(value, model, false)
    }

    if (_.isArray(result.errors) && result.errors.length) {
      Ember.Logger.log('-BUNSEN ERRORS------------------------')
      Ember.Logger.log('   `----.                ')
      Ember.Logger.log('   :::::::.              ')
      Ember.Logger.log(' `::O::::::-`            ')
      Ember.Logger.log(' -:::::::::::.           ')
      Ember.Logger.log(' `--:-. ::::::-`     ..  ')
      Ember.Logger.log('       .::::::::-..`.::  ')
      Ember.Logger.log('       .:::::::::::::-`  ')
      Ember.Logger.log('       -:::::::::::-`    ')
      Ember.Logger.log('        .:-``-::.        ')
      Ember.Logger.log('       `..  `...         ')
      for (let error of result.errors) {
        Ember.Logger.warn(`${error.message} (${error.path})`)
      }
      Ember.Logger.log('--------------------------------------')
    }
  },

  /**
   * Ensure we are working with POJO's
   */
  fixPropTypes: function () {
    ;[
      'model',
      'renderers',
      'value',
      'view'
    ].forEach((key) => {
      const propKey = `state.${key}`
      const previousObject = this.get(propKey)
      let object = this.get(key)

      if (!_.isEmpty(object) && !_.isPlainObject(object)) {
        let id = object.get('id')

        object = deemberify(object)

        // Without the below Ember Data model ID's will not work with inputs
        if (id) {
          object.id = id
        }
      }

      if (!_.isEqual(object, previousObject)) {
        this.set(propKey, object)
      }
    })
  },

  /**
   * Validate model and view when we first get them
   */
  init: function () {
    this._super()

    this.set('state', Ember.Object.create({
      propValidationResult: {
        valid: false,
        errors: Ember.A([]),
        warnings: Ember.A([])
      }
    }))

    this.fixPropTypes()
    this.validateProps()
  },

  /**
   * Validate model and view when we get updated ones
   * @param {Object} attrs - A hash of the old attributes and the new attributes
   */
  didUpdateAttrs: function (attrs) {
    const {oldAttrs, newAttrs} = attrs

    if (!_.isEqual(oldAttrs.value.value, newAttrs.value.value)) {
      this.set('state.value', newAttrs.value)
    }

    this.validateProps()

    this._super(...arguments)
  },

  willUpdate: function () {
    this.fixPropTypes()
  },

  @readOnly
  @computed('state.model')
  renderModel: function (model) {
    return dereference(model || {}).schema
  },

  @readOnly
  @computed('state.renderers', 'renderView', 'state.value')
  store: function (renderers, view, formValue) {
    return Ember.Object.create({
      formValue,
      renderers,
      view
    })
  },

  @readOnly
  @computed('renderView')
  cellConfig: function () {
    return this.get('renderView.rootContainers.0')
  },

  actions: {
    onChange: function () {
      //
    }
  }
})
