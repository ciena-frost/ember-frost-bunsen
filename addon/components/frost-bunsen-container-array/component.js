import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import layout from './template'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from '../utils'

export default Ember.Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-container-array', 'frost-bunsen-section'],
  layout,

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    model: PropTypes.object.isRequired,
    'on-change': PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false,

  /**
   * Handle new values coming in as props (either during initial render or during update)
   */
  handleNewValues: function () {
    const newValue = this.get(`store.formValue.${this.get('bunsenId')}`) || []
    const oldValue = this.get('state.items')

    if (!_.isEqual(newValue, oldValue)) {
      this.set('state.items', Ember.A(newValue))
    }
  },

  /**
   * Initialze state of container
   */
  init: function () {
    this._super()

    this.set('state', Ember.Object.create({
      items: Ember.A([])
    }))

    this.handleNewValues()
  },

  /**
   * Handle new values coming in as props
   */
  didUpdateAttrs: function () {
    this.handleNewValues()
  },

  @readOnly
  @computed('cellConfig.item.container', 'store.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  currentContainer: function (containerId, containers) {
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
  @computed('renderLabel')
  addLabel: function (renderLabel) {
    return `Add ${Ember.String.singularize(renderLabel).toLowerCase()}`
  },

  @readOnly
  @computed('cellConfig.item.inline')
  inline: function (inline) {
    return inline === undefined || inline === true
  },

  @readOnly
  @computed('currentContainer')
  /**
   * Get instructions text for current container
   * @param {BunsenContainer} container - current container
   * @returns {String} instructions text
   */
  instructions: function (container) {
    return container ? container.instructions : null
  },

  @readOnly
  @computed('bunsenId', 'cellConfig.label', 'model')
  /**
   * Get label for container
   * @param {String} bunsenId - bunsen ID for array (represents path in model)
   * @param {String} label - label
   * @param {BunsenModel} model - bunsen model
   * @returns {String} label
   */
  renderLabel: function (bunsenId, label, model) {
    return getLabel(label, model, bunsenId)
  },

  /**
   * Fire an initial BunsenChangeEvent to let parent know that a new item was added to the array
   * @param {Object} item - the item being added
   * @param {Number} index - the index of the item
   */
  notifyParentOfNewItem: function (item, index) {
    const onChange = this.get('on-change')

    if (!onChange) {
      return
    }

    onChange({
      id: `${this.get('bunsenId')}.${index}`,
      value: item
    })
  },

  actions: {
    /**
     * Add an empty item then focus on it after it's been rendererd
     */
    onAddItem: function () {
      const newItem = this.get('model').items.type === 'object' ? {} : ''
      const items = this.get('state.items')
      const index = items.length

      items.pushObject(newItem)
      this.notifyParentOfNewItem(newItem, index)
    },

    /**
     * Remove an item
     * @param {Number} index - index of item to remove
     */
    onRemoveItem: function (index) {
      const items = this.get('state.items')
      const itemToRemove = items.objectAt(index)
      items.removeObject(itemToRemove)

      const onChange = this.get('on-change')

      if (!onChange) {
        return
      }

      // since the onChange mechanism doesn't allow for removing things
      // we basically need to re-set the whole array
      onChange({
        id: this.get('bunsenId'),
        value: items
      })
    }
  }
})
