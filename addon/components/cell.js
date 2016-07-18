import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getSubModel, getModelPath} from 'bunsen-core/utils'

/**
 * Return path without an index at the end
 * i.e. "foo.bar.0" would become "foo.bar"
 * @param {String} path - path to remove index from
 * @returns {String} path without index
 */
export function removeIndex (path) {
  const parts = path.split('.')
  const last = parts.pop()
  return /^\d+$/.test(last) ? parts.join('.') : path
}

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNameBindings: ['computedClassName'],

  propTypes: {
    bunsenId: PropTypes.string,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    config: PropTypes.EmberObject.isRequired,
    defaultClassName: PropTypes.string,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  },

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('classNames', 'defaultClassName')
  /**
   * Get class name for cell
   * @param {String} classNames - class names
   * @param {String} defaultClassName - default class name
   * @returns {String} cell's class name
   */
  computedClassName (classNames, defaultClassName) {
    const classes = classNames.toString().split(' ')

    if (classes.length <= 1) { // "ember-view" is always present
      classes.push(defaultClassName)
    }

    classes.push('frost-bunsen-cell')

    return classes.join(' ')
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = this.get('renderId')

    if (_.isEmpty(errors)) {
      return null
    }

    const errorMessages = errors[bunsenId]
    return _.isEmpty(errorMessages) ? null : Ember.String.htmlSafe(errorMessages.join('<br>'))
  },

  @readOnly
  @computed('value')
  renderValue (value) {
    const bunsenId = this.get('renderId')
    return _.get(value, bunsenId)
  },

  @readOnly
  @computed('config.{dependsOn,model}')
  /**
   * Whether or not cell is required
   * @param {String} dependsOn - model cell depends on
   * @param {BunsenModel} model - bunsen model of cell
   * @returns {Boolean} whether or not cell is required
   */
  required (dependsOn, model) {
    model = removeIndex(model)
    const parentModel = this.getParentModel(model, dependsOn)
    const propertyName = model.split('.').pop()
    return _.includes(parentModel.required, propertyName)
  },

  @readOnly
  @computed('config.{dependsOn,model}', 'bunsenModel', 'nonIndexId')
  /**
   * Get sub model
   * @param {String} dependsOn - model cell depends on
   * @param {String} configModel - relative model for cell config
   * @param {BunsenModel} bunsenModel - bunsen model of form
   * @param {String} nonIndexId - ID for array that item is within (if array item)
   * @returns {BunsenModel} sub model
   */
  subModel (dependsOn, configModel, bunsenModel, nonIndexId) {
    const subModel = getSubModel(bunsenModel, removeIndex(configModel), dependsOn)

    if (!subModel) {
      return getSubModel(bunsenModel, nonIndexId, dependsOn)
    }

    return subModel
  },

  @readOnly
  @computed('bunsenId', 'config.model')
  /**
   * Get bunsen ID for cell's input
   * @param {String} bunsenId - bunsen ID
   * @param {BunsenModel} model - bunsen model
   * @returns {String} bunsen ID of input
   */
  renderId (bunsenId, model) {
    return bunsenId ? `${bunsenId}.${model}` : model
  },

  @readOnly
  @computed('renderId')
  /**
   * Get bunsen ID for array
   * @param {String} renderId - render identifier
   * @returns {Number} bunsen ID for array
   */
  nonIndexId (renderId) {
    return removeIndex(renderId)
  },

  @readOnly
  @computed('renderId')
  /**
   * Get index for single array item
   * @param {String} renderId - render identifier
   * @returns {Number} index
   */
  index (renderId) {
    return parseInt(renderId.split('.').pop(), 10)
  },

  @readOnly
  @computed('index')
  /**
   * Detemrine if we are rendering a single array item
   * @param {Number|NaN} index - index of array item or NaN
   * @returns {Boolean} whether or not we are rendering a single array item
   */
  isArrayItem (index) {
    return !isNaN(index)
  },

  @readOnly
  @computed('config.renderer', 'subModel.type')
  /**
   * Determine if sub model is of type "array"
   * @param {String} renderer - custom renderer
   * @param {String} type - type of sub model
   * @returns {Boolean} whether or not sub model is "array"
   */
  isSubModelArray (renderer, type) {
    return type === 'array' && !renderer
  },

  @readOnly
  @computed('config.renderer', 'subModel.type')
  /**
   * Determine if sub model is of type "object"
   * @param {String} renderer - custom renderer
   * @param {String} type - type of sub model
   * @returns {Boolean} whether or not sub model is "object"
   */
  isSubModelObject (renderer, type) {
    return type === 'object' && !renderer
  },

  @readOnly
  @computed('config', 'renderId', 'value')
  /**
   * Whether or not input's dependency is met
   * @param {BunsenCell} cellConfig - cell configuration for input
   * @param {String} bunsenId - bunsen ID for input
   * @param {Object} value - current value of form
   * @returns {Boolean} whether or not dependency is met
   */
  isDependencyMet (cellConfig, bunsenId, value) {
    if (!cellConfig || cellConfig.dependsOn === undefined) {
      return null
    }

    const dependencyId = bunsenId.replace(cellConfig.model, cellConfig.dependsOn)
    const dependencyValue = _.get(value, dependencyId)

    return dependencyValue !== undefined
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  /**
   * Get parent's model
   * @param {BunsenModel} reference - bunsen model of cell
   * @param {BunsenModel} dependencyReference - model cell depends on
   * @returns {BunsenModel} model of parent
   */
  getParentModel (reference, dependencyReference) {
    const model = this.get('bunsenModel')
    const path = getModelPath(reference, dependencyReference)
    const parentPath = path.split('.').slice(0, -2).join('.') // skip back past property name and 'properties'
    return (parentPath) ? _.get(model, parentPath) : model
  }

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================
})
