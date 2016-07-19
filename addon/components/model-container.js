import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {doesModelContainRequiredField, getLabel} from 'bunsen-core/utils'

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: ['frost-bunsen-model-container'],

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.null,
      PropTypes.string
    ]),
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
  @computed('cellConfig.extend', 'bunsenStore.view.cellDefinitions')
  /**
   * Get definition for current cell
   * @param {String} cellId - ID of current cell
   * @param {BunsenCell[]} cellDefinitions - list of cell definitions
   * @returns {BunsenCell} current cell definition
   */
  currentCell (cellId, cellDefinitions) {
    if (!cellId) {
      return null
    }

    return cellDefinitions[cellId] || null
  },

  @readOnly
  @computed('currentCell')
  /**
   * Determine if current cell can be collapsed
   * @param {BunsenCell} cell - current cell
   * @returns {Boolean} whether or not cell is collapsible
   */
  collapsible (cell) {
    return Boolean(cell && cell.collapsible)
  },

  @readOnly
  @computed('currentCell')
  /**
   * Get description text for current cell
   * @param {BunsenCell} cell - current cell
   * @returns {String} description text
   */
  description (cell) {
    return cell ? cell.description : null
  },

  @readOnly
  @computed('bunsenId', 'cellConfig.{label,showLabel}', 'label', 'bunsenModel')
  /**
   * Get label for cell
   * @param {String} bunsenId - bunsen ID for cell in model
   * @param {String} configLabel - label defined in view
   * @param {Boolean} showLabel - whether or not to show label
   * @param {String} label - label
   * @param {BunsenModel} bunsenModel - bunsen model
   * @returns {String} label
   */
  renderLabel (bunsenId, configLabel, showLabel, label, bunsenModel) {
    if (showLabel === false) {
      return null
    }

    label = label || configLabel
    return getLabel(label, bunsenModel, bunsenId)
  },

  @readOnly
  @computed('bunsenModel')
  /**
   * Determine whether or not cell contains required inputs
   * @param {BunsenModel} bunsenModel - bunsen model for form
   * @returns {Boolean} whether or not cell contains required inputs
   */
  isRequired (bunsenModel) {
    return doesModelContainRequiredField(bunsenModel)
  }

  // ==========================================================================
  // Functions
  // ==========================================================================

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================
})
