import {utils} from 'bunsen-core'
const {
  getLabel,
  getModelPath,
  getSubModel
} = utils

import Ember from 'ember'
const {Component, get, isEmpty, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-cell'
import {isCommonAncestor} from 'ember-frost-bunsen/tree-utils'
import {isRequired} from 'ember-frost-bunsen/utils'

const {isArray} = Array

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

/**
 * Iterates through each entry in a map
 * @param {Iterator} iterator - map iterator
 * @param {Function} iteratee - callback that is involed on every etry
 */
export function iterateMap (iterator, iteratee) {
  let current
  while (true) {
    current = iterator.next()
    if (current.done || iteratee(current.value) === false) {
      break
    }
  }
}

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

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
    unregisterForFormValueChanges: PropTypes.func,
    value: PropTypes.object
  },

  getDefaultProps () {
    return {
      readOnly: false,
      propagatedValue: {},
      propagatedValueChangeSet: null
    }
  },

  didReceiveAttrs (attrs) {
    const valueChangeSet = this.get('valueChangeSet')
    const oldCellConfig = get(attrs, 'oldAttrs.cellConfig.value')
    const newCellConfig = this.get('cellConfig')

    let isDirty = false

    if (valueChangeSet) {
      iterateMap(valueChangeSet.keys(), (bunsenId) => {
        if (isCommonAncestor(newCellConfig.__dependency__, bunsenId)) {
          isDirty = true
          return false
        }
      })
    }

    if (isDirty || !_.isEqual(oldCellConfig, newCellConfig)) {
      this.setProperties({
        'propagatedValue': this.get('value'),
        'propagatedValueChangeSet': this.get('valueChangeSet')
      })
    }

    const newClassNames = this.getClassNames()
    const oldClassNames = this.get('classNames')

    if (!_.isEqual(newClassNames, oldClassNames)) {
      this.set('classNames', newClassNames)
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('propagatedValue')
  renderValue (value) {
    const bunsenId = this.get('renderId')

    if (typeOf(value) !== 'object') {
      return undefined
    }

    return get(value, bunsenId)
  },

  @readOnly
  @computed('bunsenModel', 'bunsenView.cellDefinitions', 'cellConfig', 'value')
  /**
   * Determine whether or not cell contains required inputs
   * @param {BunsenModel} bunsenModel - bunsen model for form
   * @param {Object<String, BunsenCell>} cellDefinitions - list of cell definitions
   * @param {BunsenCell} cellConfig - bunsen view cell
   * @param {Object} value - form value
   * @returns {Boolean} whether or not cell contains required inputs
   */
  isRequired (bunsenModel, cellDefinitions, cellConfig, value) {
    return isRequired(cellConfig, cellDefinitions, bunsenModel, value)
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = this.get('renderId')

    if (typeOf(errors) !== 'object' || isEmpty(errors[bunsenId])) {
      return null
    }

    return Ember.String.htmlSafe(errors[bunsenId].join('<br>'))
  },

  @readOnly
  @computed('cellConfig.{dependsOn,model}')
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

    return (
      parentModel &&
      isArray(parentModel.required) &&
      parentModel.required.indexOf(propertyName) !== -1
    )
  },

  @readOnly
  @computed('cellConfig.{dependsOn,model}', 'bunsenModel', 'nonIndexId')
  /**
   * Get sub model
   * @param {String} dependsOn - model cell depends on
   * @param {String} configModel - relative model for cell config
   * @param {BunsenModel} bunsenModel - bunsen model of form
   * @param {String} nonIndexId - ID for array that item is within (if array item)
   * @returns {BunsenModel} sub model
   */
  subModel (dependsOn, configModel, bunsenModel, nonIndexId) {
    if (!configModel) {
      return bunsenModel
    }

    // Look for sub model using model property of cell config
    let subModel = getSubModel(bunsenModel, removeIndex(configModel), dependsOn)

    if (!subModel) {
      // Look for sub model using model property of cell config prepended with bunsen ID
      subModel = getSubModel(bunsenModel, nonIndexId, dependsOn)
    }

    if (!subModel) {
      // When working with properties within arrays we only care about the path relative to the array
      // item definition in the model (ie convert "foo.0.bar.1.baz" to "baz")
      nonIndexId = nonIndexId.replace(/^.+\.\d+\./g, '')

      subModel = getSubModel(bunsenModel, nonIndexId, dependsOn)
    }

    return subModel
  },

  @readOnly
  @computed('bunsenId', 'cellConfig.model')
  /**
   * Get bunsen ID for cell's input
   * @param {String} bunsenId - bunsen ID
   * @param {BunsenModel} model - bunsen model
   * @returns {String} bunsen ID of input
   */
  renderId (bunsenId, model) {
    if (bunsenId && model) {
      return `${bunsenId}.${model}`
    }

    return bunsenId || model || ''
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
  @computed('cellConfig.renderer', 'subModel.type')
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
  @computed('cellConfig.renderer', 'subModel.type')
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
  @computed('cellConfig', 'renderId', 'propagatedValue')
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
    const dependencyValue = get(value || {}, dependencyId)

    return dependencyValue !== undefined
  },

  @readOnly
  @computed('cellConfig')
  clearable (cellConfig) {
    return cellConfig.clearable || false
  },

  @readOnly
  @computed('cellConfig')
  compact (cellConfig) {
    return get(cellConfig, 'arrayOptions.compact') === true
  },

  @readOnly
  @computed('cellConfig')
  showSection (cellConfig) {
    return (
      cellConfig.collapsible ||
      (cellConfig.label && cellConfig.children) ||
      (cellConfig.arrayOptions && !cellConfig.hideLabel)
    )
  },

  @readOnly
  @computed('cellConfig')
  isLeafNode (cellConfig) {
    return cellConfig.model && !cellConfig.children
  },

  @readOnly
  @computed('cellConfig', 'nonIndexId', 'subModel')
  renderLabel (cellConfig, nonIndexId, subModel) {
    if (cellConfig.hideLabel) {
      return null
    }

    const label = get(cellConfig, 'label')
    return getLabel(label, subModel, nonIndexId)
  },

  // == Functions ==============================================================

  _clearChildren (cell) {
    if (!cell.children) {
      return
    }

    cell.children
      .forEach((child) => {
        if (child.model) {
          this.onChange(child.model, null)
          return
        }

        this._clearChildren(child)
      })
  },

  getClassNames () {
    const viewDefinedClass = this.get('cellConfig.classNames.cell')
    const classes = this.get('classNames').toString().split(' ')

    classes.push('frost-bunsen-cell')

    if (this.get('compact')) {
      classes.push('frost-bunsen-compact')
    }

    if (viewDefinedClass) {
      classes.push(viewDefinedClass)
    }

    return classes
  },

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
    return (parentPath) ? get(model, parentPath) : model
  },

  // == Actions ================================================================

  actions: {
    clear () {
      const bunsenId = this.get('bunsenId')

      if (bunsenId) {
        this.onChange(bunsenId, null)
      } else {
        const cell = this.get('cellConfig')
        this._clearChildren(cell)
      }
    }
  }
})
