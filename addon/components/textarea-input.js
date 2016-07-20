import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: [
    'frost-bunsen-input-textarea',
    'frost-field'
  ],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('cellConfig.renderer.cols')
  /**
   * Get how many columns textarea should contain
   * @param {Number} cols - number of columns
   * @returns {Number} number of columns
   */
  cols (cols) {
    return cols
  },

  @readOnly
  @computed('cellConfig.renderer.rows')
  /**
   * Get how many rows textarea should contain
   * @param {Number} rows - number of rows
   * @returns {Number} number of rows
   */
  rows (rows) {
    return rows
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
