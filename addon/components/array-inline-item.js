import {utils} from 'bunsen-core'
const {getLabel} = utils
import Ember from 'ember'
const {Component, get, isEmpty, isPresent, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import {singularize} from 'ember-inflector'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-inline-item'

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-item-wrapper'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    compact: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    getRootProps: PropTypes.func,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    readOny: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func.isRequired,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    showAllErrors: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
    sortable: PropTypes.bool.isRequired,
    unregisterForFormValueChanges: PropTypes.func,
    value: PropTypes.object
  },

  getDefaultProps () {
    return {
      compact: false,
      showRemoveButton: false
    }
  },

  getCell (arrayOptions, index) {
    return get(arrayOptions, `tupleCells.${index}`) ||
    get(arrayOptions, `itemCell.${index}`) ||
    arrayOptions.itemCell
  },

  @readOnly
  @computed('formDisabled', 'cellConfig')
  disabled (formDisabled, cellConfig) {
    return formDisabled || get(cellConfig, 'disabled')
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = this.get('bunsenId')

    if (typeOf(errors) !== 'object' || isEmpty(errors[bunsenId])) {
      return null
    }

    return Ember.String.htmlSafe(errors[bunsenId].join('<br>'))
  },

  @readOnly
  @computed('value', 'cellConfig.model')
  renderValue (value, model) {
    const bunsenId = this.get('bunsenId')

    if (typeOf(value) !== 'object') {
      return undefined
    }

    return get(value, bunsenId)
  },

  @readOnly
  @computed('cellConfig', 'index', 'bunsenModel', 'bunsenView.cellDefinitions')
  /**
   * Get label text for item
   * @param {Object} cellConfig - cell config
   * @param {Number} index - index of item in array
   * @param {BunsenModel} bunsenModel - bunsen model for entire form
   * @param {BunsenCell[]} cellDefinitions - view cells
   * @returns {String} label
   */
  label (cellConfig, index, bunsenModel, cellDefinitions) {
    const cellId = get(cellConfig, 'arrayOptions.itemCell.extends')
    const label = get(cellConfig, 'arrayOptions.itemCell.label')
    const itemCellConfig = cellId ? cellDefinitions[cellId] : null
    const itemId = itemCellConfig ? cellId : ''
    const itemLabel = singularize(getLabel(label, bunsenModel, itemId))
    return itemLabel ? `${itemLabel} ${index + 1}` : null
  },

  @readOnly
  @computed('cellConfig', 'index')
  itemCell (cellConfig, index) {
    const arrayOptions = get(cellConfig, 'arrayOptions')

    if (!isPresent(arrayOptions)) {
      return {}
    }

    const cell = this.getCell(arrayOptions, index)

    return isPresent(cell) && !Array.isArray(cell) ? cell : {}
  },

  // == Actions ================================================================

  actions: {
    /**
     * When user wants to remove item
     */
    remove () {
      const index = this.get('index')

      if (this.onRemove) {
        this.onRemove(index)
      }
    }
  }
})
