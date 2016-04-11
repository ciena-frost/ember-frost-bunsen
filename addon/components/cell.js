import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getSubModel, getModelPath} from '../utils'

export default Component.extend(PropTypeMixin, {
  classNameBindings: ['computedClassName'],

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

  propTypes: {
    bunsenId: PropTypes.string,
    config: PropTypes.EmberObject.isRequired,
    defaultClassName: PropTypes.string,
    errors: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = this.get('renderId')

    if (_.isEmpty(errors)) {
      return null
    }

    const errorMessages = errors[bunsenId]
    return _.isEmpty(errorMessages) ? null : errorMessages.join('/n')
  },

  // FIXME: this should be read only
  @computed('value')
  renderValue (value) {
    const bunsenId = this.get('renderId')
    return _.get(value, bunsenId)
  },

  /**
   * Get parent's model
   * @param {BunsenModel} reference - bunsen model of cell
   * @param {BunsenModel} dependencyReference - model cell depends on
   * @returns {BunsenModel} model of parent
   */
  getParentModel (reference, dependencyReference) {
    const model = this.get('model')
    const path = getModelPath(reference, dependencyReference)
    const parentPath = path.split('.').slice(0, -2).join('.') // skip back past property name and 'properties'
    return (parentPath) ? _.get(model, parentPath) : model
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
    const parentModel = this.getParentModel(model, dependsOn)
    const propertyName = model.split('.').pop()
    return _.includes(parentModel.required, propertyName)
  },

  @readOnly
  @computed('config.{dependsOn,model}', 'model')
  /**
   * Get sub model
   * @param {String} dependsOn - model cell depends on
   * @param {BunsenModel} configModel - model of current cell
   * @param {BunsenModel} model - bunsen model of form
   * @returns {BunsenModel} sub model
   */
  subModel (dependsOn, configModel, model) {
    return getSubModel(model, configModel, dependsOn)
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

  didReceiveAttrs () {
    const bunsenId = this.get('renderId')
    const cellConfig = this.get('config')
    const value = this.get('value')

    if (cellConfig && cellConfig.dependsOn !== undefined) {
      this.set('isDependencyMet', this.getIsDependencyMet(bunsenId, cellConfig, value))
    }
  },

  /**
   * Whether or not input's dependency is met
   * @param {String} bunsenId - bunsen ID for input
   * @param {BunsenCell} cell - cell configuration for input
   * @param {Object} value - current value of form
   * @returns {Boolean} whether or not dependency is met
   */
  getIsDependencyMet (bunsenId, cell, value) {
    const dependencyId = bunsenId.replace(cell.model, cell.dependsOn)
    const dependencyValue = _.get(value, dependencyId)
    return (dependencyValue !== undefined)
  },

  init () {
    this._super()

    const bunsenId = this.get('bunsenId')

    if (!bunsenId) {
      return
    }
  }
})
