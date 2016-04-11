import 'ember-frost-bunsen/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {A, Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {deemberify, getLabel} from '../utils'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-array-container', 'frost-bunsen-section'],

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  },

  /**
   * Handle new values coming in as props (either during initial render or during update)
   */
  handleNewValues () {
    const newValue = this.get(`value.${this.get('bunsenId')}`) || []
    const oldValue = this.get('state.items')

    if (!_.isEqual(newValue, oldValue)) {
      this.set('state.items', A(newValue))
    }
  },

  /**
   * Initialze state of container
   */
  init () {
    this._super()

    this.set('state', Ember.Object.create({
      items: A([])
    }))

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
  @computed('renderLabel')
  addLabel (renderLabel) {
    return `Add ${Ember.String.singularize(renderLabel).toLowerCase()}`
  },

  @readOnly
  @computed('cellConfig.item.inline')
  inline (inline) {
    return inline === undefined || inline === true
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
  @computed('bunsenId', 'cellConfig.label', 'model')
  /**
   * Get label for container
   * @param {String} bunsenId - bunsen ID for array (represents path in model)
   * @param {String} label - label
   * @param {BunsenModel} model - bunsen model
   * @returns {String} label
   */
  renderLabel (bunsenId, label, model) {
    return getLabel(label, model, bunsenId)
  },

  /**
   * Fire an initial BunsenChangeEvent to let parent know that a new item was added to the array
   * @param {Object} item - the item being added
   * @param {Number} index - the index of the item
   */
  notifyParentOfNewItem (item, index) {
    const onChange = this.get('onChange')

    if (!onChange) {
      return
    }

    onChange(`${this.get('bunsenId')}.${index}`, item)
  },

  actions: {
    /**
     * Add an empty item then focus on it after it's been rendererd
     */
    onAddItem () {
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
    onRemoveItem (index) {
      const items = this.get('state.items')
      const itemToRemove = items.objectAt(index)
      items.removeObject(itemToRemove)

      const onChange = this.get('onChange')

      if (!onChange) {
        return
      }

      // since the onChange mechanism doesn't allow for removing things
      // we basically need to re-set the whole array
      onChange(this.get('bunsenId'), items)
    }
  },

  didReceiveAttrs () {
    this._super(...arguments)
    const value = _.get(this.get('value'), this.get('bunsenId'))
    const items = this.get('state.items')

    if (!value) {
      return
    }

    if (value.length < items.length) {
      items.removeAt(value.length, items.length - value.length)
    }

    items.forEach((item, index) => {
      const incomingItem = value[index]
      const stateItem = deemberify(item)

      if (!_.isEqual(stateItem, incomingItem)) {
        _.assign(item, incomingItem)
      }
    })

    if (value.length > items.length) {
      const itemsToAdd = value.slice(items.length)
      items.pushObjects(itemsToAdd)
    }
  }
})
