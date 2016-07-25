import 'bunsen-core/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {A, Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from 'bunsen-core/utils'
import {deemberify} from '../utils'

export default Component.extend(PropTypeMixin, {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: ['frost-bunsen-array-container', 'frost-bunsen-section'],

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenStore: PropTypes.EmberObject.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
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
  @computed('renderLabel')
  addLabel (renderLabel) {
    return `Add ${Ember.String.singularize(renderLabel).toLowerCase()}`
  },

  @readOnly
  @computed('cellConfig.arrayOptions.itemCell.extends', 'bunsenStore.view.cellDefinitions')
  /**
   * Get definition for current cell
   * @param {String} cellId - ID of current cell
   * @param {BunsenCell[]} cellDefinitions - list of cell definitions
   * @returns {BunsenCell} current cell definition
   */
  currentCell (cellId, cellDefinitions) {
    if (!cellId) {
      return this.get('cellConfig')
    }

    return cellDefinitions[cellId] || null
  },

  @readOnly
  @computed('bunsenStore.disabled', 'cellConfig.disabled')
  disabled (formDisabled, disabledInView) {
    return formDisabled || disabledInView
  },

  @readOnly
  @computed('cellConfig.arrayOptions.inline')
  inline (inline) {
    return inline === undefined || inline === true
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
  @computed('bunsenId', 'cellConfig.label', 'bunsenModel')
  /**
   * Get label for cell
   * @param {String} bunsenId - bunsen ID for array (represents path in bunsenModel)
   * @param {String} label - label
   * @param {BunsenModel} bunsenModel - bunsen model
   * @returns {String} label
   */
  renderLabel (bunsenId, label, bunsenModel) {
    return getLabel(label, bunsenModel, bunsenId)
  },

  @readOnly
  @computed('inline', 'cellConfig.arrayOptions.autoAdd')
  showAddButton (inline, autoAdd) {
    return inline && !autoAdd
  },

  @readOnly
  @computed('cellConfig.arrayOptions.sortable')
  /**
   * Whether or not array items can be sorted by user
   * @param {Boolean} enabled - whether or not sorting should be enabled
   * @returns {Boolean} whether or not sorting is enabled
   */
  sortable (enabled) {
    return enabled === true
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  _getEmptyItem () {
    const type = this.get('bunsenModel.items.type')

    switch (type) {
      case 'array':
        return []

      case 'boolean':
        return null

      case 'integer':
      case 'number':
        return NaN

      case 'object':
        return {}

      case 'string':
        return ''
    }
  },

  _handleArrayChange (bunsenId, value, autoAdd) {
    // TODO: implement functionality
  },

  _handleObjectChange (bunsenId, value, autoAdd) {
    const clearingValue = [undefined, null, ''].indexOf(value) !== -1

    if (autoAdd && clearingValue) {
      const arrayPath = this.get('bunsenId')
      const itemPathBits = bunsenId.replace(`${arrayPath}.`, '').split('.')
      const itemIndex = parseInt(itemPathBits.splice(0, 1)[0], 10)
      const itemPath = `${arrayPath}.${itemIndex}`
      const item = this.get(`bunsenStore.formValue.${itemPath}`)
      const itemCopy = _.cloneDeep(item)

      let key = itemPathBits.pop()

      // If property is not not nested go ahead and clear it
      if (itemPathBits.length === 0) {
        delete itemCopy[key]
        bunsenId = bunsenId.replace(`.${key}`, '')

      // If property is nested further down clear it and remove any empty parent items
      } else {
        let relativeObject = _.get(itemCopy, itemPathBits)
        delete relativeObject[key]
        bunsenId = bunsenId.replace(`.${key}`, '')

        while (itemPathBits.length > 0) {
          key = itemPathBits.pop()
          relativeObject = _.get(itemCopy, itemPathBits, itemCopy)
          const parentObject = relativeObject[key]

          if (Object.keys(parentObject).length === 0) {
            delete relativeObject[key]
            bunsenId = bunsenId.replace(`.${key}`, '')
          }
        }
      }

      if (Object.keys(itemCopy).length === 0) {
        this.actions.onRemoveItem.call(this, itemIndex)
        return
      }

      const relativePath = bunsenId.replace(itemPath, '')
      value = _.get(itemCopy, relativePath, itemCopy)
    }

    const onChange = this.get('onChange')

    if (onChange) {
      onChange(bunsenId, value)
    }
  },

  _handlePrimitiveChange (bunsenId, value, autoAdd) {
    if (this._isItemEmpty(value)) {
      const arrayPath = this.get('bunsenId')
      const itemPathBits = bunsenId.replace(`${arrayPath}.`, '').split('.')
      const itemIndex = parseInt(itemPathBits.splice(0, 1)[0], 10)

      if (itemIndex !== 0 || !autoAdd) {
        this.actions.onRemoveItem.call(this, itemIndex)
        return
      }
    }

    const onChange = this.get('onChange')

    if (onChange) {
      onChange(bunsenId, value)
    }
  },

  _isItemEmpty (item) {
    const type = this.get('bunsenModel.items.type')

    switch (type) {
      case 'array':
        return item.length !== 0

      case 'boolean':
        return [undefined, null].indexOf(item) !== -1

      case 'integer':
      case 'number':
        return isNaN(item) || item === null

      case 'object':
        return Object.keys(item).length !== 0

      case 'string':
        return [undefined, null, ''].indexOf(item) !== -1
    }
  },

  /**
   * Handle new values coming in as props (either during initial render or during update)
   */
  handleNewValues () {
    const newValue = this.get(`value.${this.get('bunsenId')}`) || []
    const oldValue = this.get('items')

    if (!_.isEqual(newValue, oldValue)) {
      this.set('items', A(newValue))
    }
  },

  /**
   * Initialze state of cell
   */
  init () {
    this._super()
    this.handleNewValues()
  },

  didReceiveAttrs ({newAttrs, oldAttrs}) {
    this._super(...arguments)
    const value = _.get(this.get('value'), this.get('bunsenId'))
    const items = this.get('items')
    const newAutoAddValue = _.get(newAttrs, 'cellConfig.value.arrayOptions.autoAdd')
    const oldAutoAddValue = _.get(oldAttrs, 'cellConfig.value.arrayOptions.autoAdd')

    // If autoAdd is being enabled add empty item to end of array
    if (newAutoAddValue === true && oldAutoAddValue !== true) {
      items.pushObject(this._getEmptyItem())
    // If autoAdd is being disabled remove empty object from end of array
    } else if (newAutoAddValue !== true && oldAutoAddValue === true) {
      items.popObject()
    }

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

    // After syncing items array with value array make sure empty item is at the
    // end when autoAdd is enabled
    if (
      newAutoAddValue &&
      (items.length === 0 || !this._isItemEmpty(value[value.length - 1]))
    ) {
      items.pushObject(this._getEmptyItem())
    }
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

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    /**
     * Add an empty item then focus on it after it's been rendererd
     */
    onAddItem () {
      const newItem = this.get('bunsenModel').items.type === 'object' ? {} : ''
      const items = this.get('items')
      const index = items.length

      items.pushObject(newItem)
      this.notifyParentOfNewItem(newItem, index)
    },

    onChange (bunsenId, value) {
      const autoAdd = this.get('cellConfig.arrayOptions.autoAdd')
      const type = this.get('bunsenModel.items.type')

      switch (type) {
        case 'array':
          this._handleArrayChange(bunsenId, value, autoAdd)
          break

        case 'boolean':
        case 'integer':
        case 'number':
        case 'string':
          this._handlePrimitiveChange(bunsenId, value, autoAdd)
          break

        case 'object':
          this._handleObjectChange(bunsenId, value, autoAdd)
          break
      }
    },

    /**
     * Remove an item
     * @param {Number} index - index of item to remove
     */
    onRemoveItem (index) {
      const autoAdd = this.get('cellConfig.arrayOptions.autoAdd')
      const items = this.get('items')
      const itemToRemove = items.objectAt(index)
      const lastItemIndex = Math.max(0, items.length - 1)

      if (autoAdd && index === lastItemIndex) {
        return
      }

      items.removeObject(itemToRemove)

      const onChange = this.get('onChange')

      if (!onChange) {
        return
      }

      // since the onChange mechanism doesn't allow for removing things
      // we basically need to re-set the whole array
      onChange(this.get('bunsenId'), items)
    },

    /**
     * Reorder items in array
     * @param {Array} reorderedItems - reordered items
     */
    onReorderItems (reorderedItems) {
      const bunsenId = this.get('bunsenId')
      const onChange = this.get('onChange')

      this.set('items', Ember.A(reorderedItems))

      if (onChange) {
        onChange(bunsenId, reorderedItems)
      }
    }
  }
})
