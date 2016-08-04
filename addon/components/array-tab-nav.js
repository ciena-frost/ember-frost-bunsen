import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from 'bunsen-core/utils'

export default Component.extend(PropTypeMixin, {
  // == Component Properties ===================================================

  tagName: 'li',

  // == State Properties =======================================================

  propTypes: {
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenStore.disabled', 'cellConfig.disabled')
  disabled (formDisabled, disabledInView) {
    return formDisabled || disabledInView
  },

  @readOnly
  @computed(
    'cellConfig.arrayOptions.itemCell.{extends,label}', 'index', 'bunsenModel', 'bunsenStore.view.cellDefinitions'
  )
  /**
   * Get title for tab
   * @param {String} cellId - ID of cells
   * @param {String} label - label
   * @param {Number} index - index of item in array
   * @param {BunsenModel} bunsenModel - bunsen model for entire form
   * @param {BunsenCell[]} cellDefinitions - view cells
   * @returns {String} tab title
   */
  title (cellId, label, index, bunsenModel, cellDefinitions) {
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
    onRemove () {
      const index = this.get('index')
      const onRemove = this.get('onRemove')

      if (onRemove) {
        onRemove(index)
      }
    }
  }
})
