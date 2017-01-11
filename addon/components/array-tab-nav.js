import {utils} from 'bunsen-core'
const {getLabel} = utils
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-tab-nav'

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  layout,
  tagName: 'li',

  // == State Properties =======================================================

  propTypes: {
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    showAllErrors: PropTypes.bool
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('formDisabled', 'cellConfig')
  disabled (formDisabled, cellConfig) {
    return formDisabled || _.get(cellConfig, 'disabled')
  },

  @readOnly
  @computed('cellConfig', 'index', 'bunsenModel', 'bunsenView.cellDefinitions')
  /**
   * Get title for tab
   * @param {Object} cellConfig - cell config
   * @param {Number} index - index of item in array
   * @param {BunsenModel} bunsenModel - bunsen model for entire form
   * @param {BunsenCell[]} cellDefinitions - view cells
   * @returns {String} tab title
   */
  title (cellConfig, index, bunsenModel, cellDefinitions) {
    const cellId = _.get(cellConfig, 'arrayOptions.itemCell.extends')
    const label = _.get(cellConfig, 'arrayOptions.itemCell.label')
    const itemCellConfig = cellId ? cellDefinitions[cellId] : null
    const itemId = itemCellConfig ? cellId : ''
    const itemLabel = getLabel(label, bunsenModel, itemId)
    return itemLabel ? `${itemLabel} ${index + 1}` : `${index + 1}`
  },

  // == Actions ================================================================

  actions: {
    /**
     * When user wants to remove item
     */
    remove () {
      const index = this.get('index')
      this.onRemove(index)
    }
  }
})
