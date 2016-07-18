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
  @computed('cellConfig.container', 'bunsenStore.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  config (containerId, containers) {
    const result = _.findWhere(containers, {id: containerId})

    if (!result || !result.rows) {
      return result
    }

    return result
  },

  @readOnly
  @computed('bunsenModel')
  /**
   * Determine whether or not container contains required inputs
   * @param {BunsenModel} bunsenModel - bunsen model for form
   * @returns {Boolean} whether or not container contains required inputs
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
