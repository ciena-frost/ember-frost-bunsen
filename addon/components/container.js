import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {doesModelContainRequiredField} from 'bunsen-core/utils'

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: ['frost-bunsen-container'],

  propTypes: {
    bunsenId: PropTypes.string,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
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
  @computed('cellConfig.extends', 'bunsenStore.view.cellDefinitions')
  /**
   * Get definition for current cell
   * @param {String} cellId - ID of current cell
   * @param {BunsenCell[]} cellDefinitions - list of cell definitions
   * @returns {BunsenCell} current cell definition
   */
  config (cellId, cellDefinitions) {
    const result = _.findWhere(cellDefinitions, {id: cellId})

    if (!result || !result.children) {
      return result
    }

    return result
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
