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
  @computed('cellConfig.container', 'bunsenStore.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  currentContainer (containerId, containers) {
    if (!containerId) {
      return null
    }

    containers = containers.filterBy('id', containerId)

    if (containers.length === 0) {
      return null
    }

    return containers[0]
  },

  @readOnly
  @computed('currentContainer')
  /**
   * Determine if current container can be collapsed
   * @param {BunsenContainer} container - current container
   * @returns {Boolean} whether or not container is collapsible
   */
  collapsible (container) {
    return Boolean(container && container.collapsible)
  },

  @readOnly
  @computed('currentContainer')
  /**
   * Get instructions text for current container
   * @param {BunsenContainer} container - current container
   * @returns {String} instructions text
   */
  instructions (container) {
    return container ? container.instructions : null
  },

  @readOnly
  @computed('bunsenId', 'cellConfig.{label,showLabel}', 'label', 'bunsenModel')
  /**
   * Get label for container
   * @param {String} bunsenId - bunsen ID for container in model
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
