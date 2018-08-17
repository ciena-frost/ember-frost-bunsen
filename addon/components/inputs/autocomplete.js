import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'
import Ember from 'ember'
const {A, getWithDefault, isEmpty, isPresent} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

export default SelectInput.extend({
  // == Component Properties ===================================================
  classNames: [
    'frost-bunsen-input-autocomplete',
    'frost-field'
  ],

  layout,

  getDefaultProps () {
    return {
      ignoreEmptyFilterSearch: true,
      filter: '',
      _focused: false,
      /** Keep track of isTyping state to know when to show selectedItem's label.
       * Ie shouldn't show label when filter is empty and not typing.
       * Used for case where user backspaces all the way (while they have a selected item),
       *  with the intention of starting with a new letter
       */
      _isTyping: false
    }
  },

  // == Computed Properties ====================================================
  @readOnly
  @computed('isAsyncGet', 'updateItems.isRunning', '_emptyFilter')
  asyncLoading (isAsyncGet, isUpdateItemsRunning, emptyFilter) {
    if (isAsyncGet) {
      return emptyFilter || isUpdateItemsRunning
    }
    return false
  },
  @readOnly
  @computed('filter')
  _emptyFilter (filter) {
    return isEmpty(filter)
  },
  @readOnly
  @computed('value', 'options.[]')
  selectedItemWithLabel (value, options) {
    return this._findSelectedItemGivenValue(value, options)
  },

  // == Functions ==============================================================
  /**
   * Return selectedItem given value chosen
   * @param {String} value - value of selected item
   * @param {Array} data - array of items displayed in autocomplete
   * @returns {Object} selected item
   */
  _findSelectedItemGivenValue (value, data) {
    if (typeof value === 'string' && data) {
      return A(data).findBy('value', value)
    }

    return value
  },
  /**
   * Return selectedItem given value chosen
   * @param {String} value - value of selected item
   * @param {Array} data - array of items displayed in autocomplete
   * @returns {String} selected item label
   */
  _findSelectedItemLabelGivenValue (value = {}, data) {
    let label = getWithDefault(value, 'label', '')
    if (typeof value === 'string') {
      const foundItem = this._findSelectedItemGivenValue(value, data) || {}
      label = getWithDefault(foundItem, 'label', '')
    }
    return label
  },
  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {String} data - value to parse
   * @returns {String} parsed value
   */
  parseValue (data) {
    return data
  },

  // == Events =================================================================
  didUpdateAttrs () {
    const {_focused, _isTyping, filter, value} = this.getProperties('_isTyping', '_focused', 'filter', 'value')
    // Clear filter when value is cleared
    if (isEmpty(value) && isPresent(filter) && !_isTyping && !_focused) this.set('filter', '')
  },

  // == Actions ===============================================================
  actions: {
    onInput (filterValue) {
      const focused = this.get('_focused')

      this.setProperties({
        filter: filterValue,
        // If you're focused and onInput fires, you're typing
        _isTyping: focused
      })
      this.send('filterOptions', filterValue)
    },
    onSelectedItem (selectedItem) {
      const filter = this._findSelectedItemLabelGivenValue(selectedItem, this.get('options'))
      this.setProperties({
        filter: filter,
        // Just selected an item, you're no longer typing
        _isTyping: false
      })
      this.send('handleChange', selectedItem)
    },
    onFocus () {
      this.set('_focused', true)
      this.send('hideErrorMessage')
    },
    onBlur () {
      this.setProperties({
        _focused: false,
        // Exited focus of text field, no longer typing
        _isTyping: false
      })
      this.send('showErrorMessage')
    }
  }
})
