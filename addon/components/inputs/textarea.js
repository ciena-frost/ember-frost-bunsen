import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-textarea'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-textarea',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

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
})
