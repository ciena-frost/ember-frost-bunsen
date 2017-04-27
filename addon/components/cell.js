import {utils} from 'bunsen-core'
const {
  getLabel,
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
  @computed('bunsenModel', 'bunsenView.cellDefinitions', 'cellConfig.children')
  children (bunsenModel, cellDefinitions, children) {
    if (!isArray(children)) return null

    return children.map((child) => {
      let subModel = bunsenModel
      if (child.model) subModel = getSubModel(bunsenModel, child.model, child.dependsOn)

      return {
        cellConfig: child,
        bunsenModel: subModel
      }
    })
  },

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
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = this.get('renderId')

    if (typeOf(errors) !== 'object' || isEmpty(errors[bunsenId])) {
      return null
    }

    return Ember.String.htmlSafe(errors[bunsenId].join('<br>'))
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
  @computed('cellConfig.renderer', 'bunsenModel.type')
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
  @computed('cellConfig.renderer', 'bunsenModel.type')
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
  @computed('cellConfig', 'bunsenModel.type')
  showSection (cellConfig, type) {
    return (
      cellConfig.collapsible ||
      (cellConfig.label && cellConfig.children) ||
      (type === 'array' && !cellConfig.hideLabel)
    )
  },

  @readOnly
  @computed('cellConfig')
  isLeafNode (cellConfig) {
    return cellConfig.model && !cellConfig.children
  },

  @readOnly
  @computed('cellConfig', 'nonIndexId', 'bunsenModel')
  renderLabel (cellConfig, nonIndexId, bunsenModel) {
    if (cellConfig.hideLabel) {
      return null
    }

    const label = get(cellConfig, 'label')
    return getLabel(label, bunsenModel, nonIndexId)
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
