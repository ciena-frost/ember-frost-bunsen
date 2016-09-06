import 'bunsen-core/typedefs'

import _ from 'lodash'
import Ember from 'ember'
const {A, Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from 'bunsen-core/utils'
import {deemberify} from '../utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-container'

export default Component.extend(PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-array-container', 'frost-bunsen-section'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    formValue: PropTypes.EmberObject,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    required: PropTypes.bool,
    showAllErrors: PropTypes.bool,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      formValue: Ember.Object.create({}),
      readOnly: false
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('renderLabel')
  addLabel (renderLabel) {
    return `Add ${Ember.String.singularize(renderLabel).toLowerCase()}`
  },

  @readOnly
  @computed('cellConfig', 'bunsenView.cellDefinitions')
  /**
   * Get definition for current cell
   * @param {Object} cellConfig - cell config
   * @param {BunsenCell[]} cellDefinitions - list of cell definitions
   * @returns {BunsenCell} current cell definition
   */
  currentCell (cellConfig, cellDefinitions) {
    const cellId = _.get(cellConfig, 'arrayOptions.itemCell.extends')

    if (!cellId) {
      return this.get('cellConfig')
    }

    return cellDefinitions[cellId] || null
  },

  @readOnly
  @computed('formDisabled', 'cellConfig')
  disabled (formDisabled, cellConfig) {
    return formDisabled || _.get(cellConfig, 'disabled')
  },

  @readOnly
  @computed('cellConfig')
  inline (cellConfig) {
    const inline = _.get(cellConfig, 'arrayOptions.inline')
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
  @computed('bunsenId', 'cellConfig', 'bunsenModel')
  /**
   * Get label for cell
   * @param {String} bunsenId - bunsen ID for array (represents path in bunsenModel)
   * @param {Object} cellConfig - cell config
   * @param {BunsenModel} bunsenModel - bunsen model
   * @returns {String} label
   */
  renderLabel (bunsenId, cellConfig, bunsenModel) {
    const label = _.get(cellConfig, 'label')
    return getLabel(label, bunsenModel, bunsenId)
  },

  @readOnly
  @computed('inline', 'cellConfig')
  showAddButton (inline, cellConfig) {
    return inline && !_.get(cellConfig, 'arrayOptions.autoAdd')
  },

  @readOnly
  @computed('cellConfig')
  /**
   * Whether or not array items can be sorted by user
   * @param {Object} cellConfig - cell config
   * @returns {Boolean} whether or not sorting is enabled
   */
  sortable (cellConfig) {
    return _.get(cellConfig, 'arrayOptions.sortable') === true
  },

  // == Functions ==============================================================

  _getEmptyItem () {
    const type = this.get('bunsenModel.items.type')

    switch (type) {
      case 'array':
        return []

      case 'boolean':
        return false

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
      const item = this.get(`formValue.${itemPath}`)
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

      const relativePath = bunsenId.replace(itemPath, '').replace(/^\./, '')
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
        return [undefined, null].indexOf(item) !== -1 || Object.keys(item).length === 0

      case 'string':
        return [undefined, null, ''].indexOf(item) !== -1
    }
  },

  /**
   * Handle new values coming in as props (either during initial render or during update)
   */
  handleNewValues () {
    let newValue = this.get(`value.${this.get('bunsenId')}`) || []
    const oldValue = this.get('items')

    if (!_.isEqual(newValue, oldValue)) {
      // Make sure new value is not immutable as Ember.A() will choke
      if (typeof newValue === 'object' && 'asMutable' in newValue) {
        newValue = newValue.asMutable({deep: true})
      }

      this.set('items', A(newValue))
    }
  },

  /**
   * Initialze state of cell
   */
  init () {
    this._super(...arguments)
    this.handleNewValues()
    this.registerForFormValueChanges(this)
  },

  /**
   * Method called by parent when formValue changes
   * @param {Object} newValue - the new formValue
   */
  formValueChanged (newValue) {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return
    }

    this.set('formValue', newValue)
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
      items.clear()

      // Make sure empty item is present when autoAdd is enabled
      if (newAutoAddValue) {
        items.pushObject(this._getEmptyItem())
      }
    } else {
      // Remove extra items
      if (value.length < items.length) {
        items.removeAt(value.length, items.length - value.length)
      }

      // Update items
      items.forEach((item, index) => {
        let incomingItem = value[index]
        const stateItem = deemberify(item)

        if (!_.isEqual(stateItem, incomingItem)) {
          if (typeof incomingItem === 'object' && 'asMutable' in incomingItem) {
            incomingItem = incomingItem.asMutable({deep: true})
          }

          _.assign(item, incomingItem)
        }
      })

      // Add missing items
      if (value.length > items.length) {
        let itemsToAdd = value.slice(items.length)

        if (typeof itemsToAdd === 'object' && 'asMutable' in itemsToAdd) {
          itemsToAdd = itemsToAdd.asMutable({deep: true})
        }

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
    }
  },

  /**
   * Fire an initial BunsenChangeEvent to let parent know that a new item was added to the array
   * @param {Object} item - the item being added
   * @param {Number} index - the index of the item
   */
  notifyParentOfNewItem (item, index) {
    const bunsenId = this.get('bunsenId')
    const onChange = this.get('onChange')

    if (!onChange) {
      return
    }

    if (this.get(`formValue.${bunsenId}`)) {
      onChange(`${bunsenId}.${index}`, item)
    } else {
      onChange(bunsenId, [item])
    }
  },

  // == Actions ================================================================

  actions: {
    /**
     * Add an empty item then focus on it after it's been rendererd
     */
    onAddItem () {
      const newItem = this._getEmptyItem()
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
      const lastItemIndex = Math.max(0, items.length - 1)

      if (autoAdd && index === lastItemIndex) {
        return
      }

      const bunsenId = this.get('bunsenId')
      const oldValue = this.get(`value.${bunsenId}`)
      const onChange = this.get('onChange')
      const newValue = oldValue.slice(0, index).concat(oldValue.slice(index + 1))

      // since the onChange mechanism doesn't allow for removing things
      // we basically need to re-set the whole array
      onChange(bunsenId, newValue)
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
