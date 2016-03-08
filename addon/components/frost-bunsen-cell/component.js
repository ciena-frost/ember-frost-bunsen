import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'

import FrostComponent, {PropTypes} from 'ember-frost-component'
import layout from './template'
import {getSubModel, getModelPath} from '../utils'

export default FrostComponent.extend({
  classNameBindings: ['computedClassName'],
  layout,

  @readOnly
  @computed('classNames', 'defaultClassName')
  /**
   * Get class name for cell
   * @param {String} classNames - class names
   * @param {String} defaultClassName - default class name
   * @returns {String} cell's class name
   */
  computedClassName: function (classNames, defaultClassName) {
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
    model: PropTypes.object.isRequired,
    'on-change': PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false,

  /**
   * Get parent's model
   * @param {BunsenModel} reference - bunsen model of cell
   * @param {BunsenModel} dependencyReference - model cell depends on
   * @returns {BunsenModel} model of parent
   */
  getParentModel: function (reference, dependencyReference) {
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
  required: function (dependsOn, model) {
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
  subModel: function (dependsOn, configModel, model) {
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
  renderId: function (bunsenId, model) {
    return bunsenId ? `${bunsenId}.${model}` : model
  },

  @readOnly
  @computed('store.formValue', 'renderId')
  /**
   * Initial value for cell's input
   * @param {Object} formValue - current value of form
   * @param {String} renderId -bunsen ID for cell's input
   * @returns {Object} initial value for input
   */
  initialValue: function (formValue, renderId) {
    return this.get(`store.formValue.${renderId}`)
  },

  @readOnly
  @computed('config.renderer', 'subModel.type')
  /**
   * Determine if sub model is of type "array"
   * @param {String} renderer - custom renderer
   * @param {String} type - type of sub model
   * @returns {Boolean} whether or not sub model is "array"
   */
  isSubModelArray: function (renderer, type) {
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
  isSubModelObject: function (renderer, type) {
    return type === 'object' && !renderer
  }
})
