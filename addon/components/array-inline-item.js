import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from 'bunsen-core/utils'

export default Component.extend(PropTypeMixin, {
  // == Component Properties ===================================================

  classNameBindings: ['compact:compact'],
  classNames: ['item-wrapper'],

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    readOny: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
    sortable: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      showRemoveButton: true
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig.arrayOptions.compact')
  compact (compact) {
    return compact === true
  },

  @readOnly
  @computed('cellConfig.arrayOptions.itemCell.renderer.name', 'bunsenStore.renderers')
  /**
   * Get name of component for custom renderer
   * @param {String} renderer - custom renderer to use
   * @returns {String} name of custom renderer component
   */
  customRenderer (renderer) {
    return this.get(`bunsenStore.renderers.${renderer}`)
  },

  @readOnly
  @computed('bunsenStore.disabled', 'cellConfig.disabled')
  disabled (formDisabled, disabledInView) {
    return formDisabled || disabledInView
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`

    if (_.isEmpty(errors)) {
      return null
    }

    const errorMessages = errors[bunsenId]
    return _.isEmpty(errorMessages) ? null : Ember.String.htmlSafe(errorMessages.join('<br>'))
  },

  @readOnly
  @computed('value')
  renderValue (value) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`
    return _.get(value, bunsenId)
  },

  @readOnly
  @computed(
    'cellConfig.arrayOptions.itemCell.{extends,label}', 'index', 'bunsenModel', 'bunsenStore.view.cellDefinitions'
  )
  /**
   * Get label text for item
   * @param {String} cellId - ID of cell
   * @param {String} label - label
   * @param {Number} index - index of item in array
   * @param {BunsenModel} bunsenModel - bunsen model for entire form
   * @param {BunsenCell[]} cellDefinitions - view cells
   * @returns {String} label
   */
  label (cellId, label, index, bunsenModel, cellDefinitions) {
    const itemCellConfig = cellId ? cellDefinitions[cellId] : null
    const itemId = itemCellConfig ? cellId : ''
    const itemLabel = Ember.String.singularize(getLabel(label, bunsenModel, itemId))
    return itemLabel ? `${itemLabel} ${index + 1}` : null
  },

  @readOnly
  @computed('cellConfig.arrayOptions.itemCell')
  itemCell (itemCell) {
    return itemCell || Ember.Object.create({})
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
