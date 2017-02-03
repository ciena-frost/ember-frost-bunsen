import {utils} from 'bunsen-core'
const {getLabel} = utils
import Ember from 'ember'
const {A, Component, get, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-container'

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
  @computed('bunsenModel', 'cellConfig', 'inline', 'items')
  showAddButton (bunsenModel, cellConfig, inline, items) {
    const maxItems = this.get('bunsenModel.maxItems')

    // If we've reached max items don't allow more to be added
    if (maxItems && maxItems <= items.length) {
      return false
    }

    return inline && !get(cellConfig, 'arrayOptions.autoAdd')
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
  @computed('bunsenId', 'readOnly', 'value')
  items (bunsenId, readOnly, value) {
    if (typeOf(value) === 'object' && 'asMutable' in value) {
      value = value.asMutable({deep: true})
    }

    const items = _.get(value, bunsenId) || []

    if (
      readOnly !== true &&
      this.get('cellConfig.arrayOptions.autoAdd') === true
    ) {
      items.push(this._getEmptyItem())
    }

    return A(items)
  },

  // == Functions ==============================================================

  /* eslint-disable complexity */
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
        this.send('removeItem', itemIndex)
        return
      }

      const relativePath = bunsenId.replace(itemPath, '').replace(/^\./, '')
      value = _.get(itemCopy, relativePath, itemCopy)
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
        return [undefined, null].indexOf(item) !== -1 || Object.keys(item).length === 0

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
    const newItems = _.get(newValue, bunsenId)
    const oldItems = _.get(this.get('value'), bunsenId)

    if (!_.isEqual(oldItems, newItems)) {
      this.notifyPropertyChange('value')
    }

    this.set('formValue', newValue)
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
      const items = _.get(value, bunsenId) || []
      const index = items.length

      this.onChange(`${bunsenId}.${index}`, newItem)
    },

    /* eslint-disable complexity */
    handleChange (bunsenId, value) {
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
    /* eslint-enable complexity */

    /**
     * Remove an item
     * @param {Number} index - index of item to remove
     */
    removeItem (index) {
      const bunsenId = this.get('bunsenId')
      const value = this.get('value')
      const items = _.get(value, bunsenId) || []
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
