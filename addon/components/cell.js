import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-cell'
import {getMergedConfig, isRequired} from 'ember-frost-bunsen/utils'

import {
  getSubModel,
  getModelPath
} from 'bunsen-core/utils'

/**
 * Return path without an index at the end
 * i.e. "foo.bar.0" would become "foo.bar"
 * @param {String} path - path to remove index from
 * @returns {String} path without index
 */
export function removeIndex (path) {
  const parts = (path || '').split('.')
  const last = parts.length !== 0 ? parts.pop() : ''
  return /^\d+$/.test(last) ? parts.join('.') : path || ''
}

export default Component.extend(PropTypeMixin, {
  // == Component Properties ===================================================

  classNameBindings: ['computedClassName'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    showAllErrors: PropTypes.bool,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig', 'bunsenView.cellDefinitions')
  /**
   * Get definition for current cell
   * @param {BunsenCell} cellConfig - current cell
   * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
   * @returns {BunsenCell} current cell definition
   */
  mergedConfig (cellConfig, cellDefinitions) {
    return getMergedConfig(cellConfig, cellDefinitions)
  },

  @readOnly
  @computed('bunsenModel', 'bunsenView.cellDefinitions', 'mergedConfig')
  /**
   * Determine whether or not cell contains required inputs
   * @param {BunsenModel} bunsenModel - bunsen model for form
   * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
   * @param {BunsenCell} mergedConfig - bunsen view cell
   * @returns {Boolean} whether or not cell contains required inputs
   */
  isRequired (bunsenModel, cellDefinitions, mergedConfig) {
    return isRequired(mergedConfig, cellDefinitions, bunsenModel)
  },

  @readOnly
  @computed('classNames')
  /**
   * Get class name for cell
   * @param {String} classNames - class names
   * @returns {String} cell's class name
   */
  computedClassName (classNames) {
    const viewDefinedClass = this.get('mergedConfig.classNames.cell')
    const classes = classNames.toString().split(' ')

    classes.push('frost-bunsen-cell')

    if (viewDefinedClass) {
      classes.push(viewDefinedClass)
    }

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
  @computed('mergedConfig.{dependsOn,model}')
  /**
   * Whether or not cell is required
   * @param {String} dependsOn - model cell depends on
   * @param {BunsenModel} model - bunsen model of cell
   * @returns {Boolean} whether or not cell is required
   */
  required (dependsOn, model) {
    model = removeIndex(model)
    const parentModel = this.getParentModel(model, dependsOn)

    if (!parentModel) {
      return false
    }

    const propertyName = model.split('.').pop()
    return _.includes(parentModel.required, propertyName)
  },

  @readOnly
  @computed('mergedConfig.{dependsOn,model}', 'bunsenModel', 'nonIndexId')
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
  @computed('bunsenId', 'mergedConfig.model')
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
  @computed('mergedConfig.renderer', 'subModel.type')
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
  @computed('mergedConfig.renderer', 'subModel.type')
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
  @computed('mergedConfig', 'renderId', 'value')
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

  @readOnly
  @computed('isSubModelObject', 'mergedConfig')
  showSection (isSubModelObject, mergedConfig) {
    // If sub model is object we end up running through another cell and thus if
    // this method were to return true we'd end up with duplicate headings.
    if (mergedConfig.model && isSubModelObject) {
      return false
    }

    return (
      mergedConfig.collapsible ||
      (mergedConfig.label && mergedConfig.children)
    )
  },

  // == Functions ==============================================================

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
})
