import {utils} from 'bunsen-core'
const {getLabel} = utils
import Ember from 'ember'
const {A, Component, get, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import {singularize} from 'ember-inflector'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-container'

const {keys} = Object

/**
 * Finds the index of an item in an array based on the bunsen ID's of the item and its containing array
 *
 * @param {String} arrayId Bunsen ID of the array
 * @param {String} itemId Bunsen ID of the item in the array
 * @returns {String} Index of array item (as a string)
 */
function itemIndex (arrayId, itemId) {
  return itemId.slice(arrayId.length + 1).split('.')[0]
}

/**
 * Recursively clears empty objects based on a path
 *
 * @param {Object} object Hash containing object
 * @param {String[]} path Array of path segments to the desired value to clear
 * @param {Number} pathIndex Index of the path segment to use as a key
 * @returns {Boolean} True if a key was deleted from the passed in object
 */
function clearSubObject (object, path, pathIndex) {
  const key = path[pathIndex]
  if (path.length < pathIndex + 2) {
    delete object[key]
    return true
  }
  const subObj = object[key]
  const didClear = clearSubObject(subObj, path, pathIndex + 1)
  if (didClear && keys(subObj).length <= 0) {
    delete object[key]
    return true
  }
  return false
}

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-array-container', 'frost-bunsen-section'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    compact: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    formValue: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    required: PropTypes.bool,
    showAllErrors: PropTypes.bool,
    unregisterForFormValueChanges: PropTypes.func,
    value: PropTypes.object
  },

  getDefaultProps () {
    return {
      compact: false,
      formValue: Ember.Object.create({}),
      readOnly: false
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('bunsenId', 'cellConfig', 'bunsenModel')
  /**
   * Get label for cell
   * @param {String} bunsenId - bunsen ID for array (represents path in bunsenModel)
   * @param {Object} cellConfig - cell config
   * @param {BunsenModel} bunsenModel - bunsen model
   * @returns {String} label
   */
  addLabel (bunsenId, cellConfig, bunsenModel) {
    const label = get(cellConfig, 'label')
    const renderLabel = getLabel(label, bunsenModel, bunsenId)
    return `Add ${singularize(renderLabel).toLowerCase()}`
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
    const cellId = get(cellConfig, 'arrayOptions.itemCell.extends')

    if (!cellId) {
      return this.get('cellConfig')
    }

    return cellDefinitions[cellId] || null
  },

  @readOnly
  @computed('formDisabled', 'cellConfig')
  disabled (formDisabled, cellConfig) {
    return formDisabled || get(cellConfig, 'disabled')
  },

  @readOnly
  @computed('cellConfig')
  inline (cellConfig) {
    const inline = get(cellConfig, 'arrayOptions.inline')
    return inline === undefined || inline === true
  },

  @readOnly
  @computed('bunsenModel', 'cellConfig', 'inline', 'maxItemsReached')
  showAddButton (bunsenModel, cellConfig, inline, maxItemsReached) {
    // If we've reached max items don't allow more to be added
    if (maxItemsReached) {
      return false
    }
    if (Array.isArray(bunsenModel.items) && !bunsenModel.additionalItems && bunsenModel.tuple) {
      return false
    }

    return inline && !get(cellConfig, 'arrayOptions.autoAdd')
  },

  @readOnly
  @computed('bunsenModel.maxItems', 'value', 'bunsenId')
  maxItemsReached (maxItems, value, bunsenId) {
    if (value && maxItems) {
      return get(value, bunsenId).length >= maxItems
    }
    return false
  },

  @readOnly
  @computed('cellConfig', 'readOnly')
  /**
   * Whether or not array items can be sorted by user
   * @param {Object} cellConfig - cell config
   * @param {Boolean} readOnly - whether or not form is read only
   * @returns {Boolean} whether or not sorting is enabled
   */
  sortable (cellConfig, readOnly) {
    return (
      readOnly !== true &&
      get(cellConfig, 'arrayOptions.sortable') === true
    )
  },

  @readOnly
  @computed('bunsenModel')
  itemsModel (model) {
    const itemModels = model.items
    if (Array.isArray(itemModels) && model.tuple) {
      return model.additionalItems
    }
  },
  @readOnly
  @computed('bunsenId', 'readOnly', 'value', 'bunsenModel', 'cellConfig.arrayOptions.itemCell')
  /* eslint-disable complexity*/
  items (bunsenId, readOnly, value, bunsenModel, cellConfig) {
    const itemModels = bunsenModel.items
    if (typeOf(value) === 'object' && 'asMutable' in value) {
      value = value.asMutable({deep: true})
    }

    const items = get(value || {}, bunsenId) || []

    let getModel, getCellConfig

    if (Array.isArray(bunsenModel.items)) {
      getModel = (item, index) => bunsenModel.items[index] || bunsenModel.additionalItems
    } else {
      getModel = () => bunsenModel.items
    }

    if (Array.isArray(cellConfig)) {
      getCellConfig = (item, index) => cellConfig[index] || cellConfig[cellConfig.length - 1] || {}
    } else {
      getCellConfig = () => cellConfig || {}
    }

    if (
      readOnly !== true &&
      this.get('cellConfig.arrayOptions.autoAdd') === true
    ) {
      items.push(this._getEmptyItem())
    }
    const makeItem = (item, index) => {
      const model = getModel(item, index)
      const cellConfig = getCellConfig(item, index)
      return {model, cellConfig}
    }
    if (Array.isArray(itemModels) && bunsenModel.tuple) {
      return A(_.map(items.slice(itemModels.length), makeItem))
    }
    return A(_.map(items, makeItem))
  },
  /* eslint-enable complexity*/

  @readOnly
  @computed('bunsenId', 'bunsenModel', 'value')
  startingIndex (bunsenId, bunsenModel, value) {
    const items = bunsenModel.items
    if (Array.isArray(items) && bunsenModel.tuple) {
      return items.length
    }
    return 0
  },

  @readOnly
  @computed('bunsenModel')
  tupleItems (model) {
    if (Array.isArray(model.items) && model.tuple) {
      return model.items
    }
  },

  // == Functions ==============================================================

  /* eslint-disable complexity */
  _getEmptyItem (model) {
    const type = model ? model.type
      : this.get('bunsenModel.items.type') || this.get('bunsenModel.additionalItems.type')

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
  /* eslint-enable complexity */

  _handleArrayChange (bunsenId, value, autoAdd) {
    const clearingValue = [undefined, null, ''].indexOf(value) !== -1
    if (autoAdd && clearingValue) {
      return
      // TODO: implement functionality
    }
    this.onChange(bunsenId, value)
  },

  /* eslint-disable complexity */
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
        clearSubObject(itemCopy, itemPathBits, 0)
      }

      if (keys(itemCopy).length === 0) {
        this.send('removeItem', itemIndex)
        return
      }
      const subPathLen = itemPath.length === 0 ? 0 : itemPath.length + 1
      const relativePath = bunsenId.slice(subPathLen)
      value = get(itemCopy, relativePath)
    }

    this.onChange(bunsenId, value)
  },
  /* eslint-enable complexity */

  _handlePrimitiveChange (bunsenId, value, autoAdd) {
    if (this._isItemEmpty(value)) {
      const arrayPath = this.get('bunsenId')
      const itemPathBits = bunsenId.replace(`${arrayPath}.`, '').split('.')
      const itemIndex = parseInt(itemPathBits.splice(0, 1)[0], 10)

      this.send('removeItem', itemIndex)
      return
    }
    this.onChange(bunsenId, value)
  },

  /* eslint-disable complexity */
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
        return [undefined, null].indexOf(item) !== -1 || keys(item).length === 0

      case 'string':
        return [undefined, null, ''].indexOf(item) !== -1
    }
  },
  /* eslint-enable complexity */

  /**
   * Initialze state of cell
   */
  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  },

  /**
   * Method called by parent when formValue changes
   * @param {Object} newValue - the new formValue
   */
  formValueChanged (newValue) {
    const bunsenId = this.get('bunsenId')
    const newItems = get(newValue || {}, bunsenId)
    const oldItems = get(this.get('value') || {}, bunsenId)

    if (!_.isEqual(oldItems, newItems)) {
      this.notifyPropertyChange('value')
    }

    this.set('formValue', newValue)
  },

  itemType (itemId) {
    return this.get('bunsenModel.items.type') ||
      this.get(`bunsenModel.items.${itemIndex(this.get('bunsenId'), itemId)}.type`) ||
      this.get('bunsenModel.additionalItems.type')
  },

  // == Actions ================================================================

  actions: {
    /**
     * Add an empty item then focus on it after it's been rendererd
     */
    addItem () {
      const bunsenId = this.get('bunsenId')
      const newItem = this._getEmptyItem()
      const value = this.get('value')
      const items = get(value || {}, bunsenId) || []
      const index = Math.max(items.length, this.get('bunsenModel.items.length') || 0)

      this.onChange(`${bunsenId}.${index}`, newItem)
    },

    /* eslint-disable complexity */
    handleChange (bunsenId, value) {
      const autoAdd = this.get('cellConfig.arrayOptions.autoAdd')
      const type = this.itemType(bunsenId)

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
    /* eslint-enable complexity */

    /**
     * Remove an item
     * @param {Number} index - index of item to remove
     */
    removeItem (index) {
      const bunsenId = this.get('bunsenId')
      const value = this.get('value')
      const items = get(value || {}, bunsenId) || []
      const newValue = items.slice(0, index).concat(items.slice(index + 1))

      // since the onChange mechanism doesn't allow for removing things
      // we basically need to re-set the whole array
      this.onChange(bunsenId, newValue)
    },

    /**
     * Reorder items in array
     * @param {Array} reorderedItems - reordered items
     */
    reorderItems (reorderedItems) {
      const bunsenId = this.get('bunsenId')

      this.onChange(bunsenId, reorderedItems)
    }
  }
})
