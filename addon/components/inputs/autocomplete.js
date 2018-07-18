import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'
import Ember from 'ember'
const {A, get, getWithDefault, isEmpty, observer} = Ember
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
      _isTyping: false
    }
  },
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
    if (typeof value === 'string' && options) {
      return this._findSelectedItemGivenValue(value, options) || value
    }

    return value
  },

  /**
   * Return selectedItem given value chosen
   * @param {String} value - value of selected item
   * @param {Array} data - array of items displayed in autocomplete
   * @returns {Object} selected item
   */
  _findSelectedItemGivenValue (value, data) {
    if (typeof value === 'string' && data) {
      return A(data).findBy('value', value) || value
    }

    return value
  },
  /**
   * Return selectedItem given value chosen
   * @param {String} value - value of selected item
   * @param {Array} data - array of items displayed in autocomplete
   * @returns {String} selected item label
   */
  _findSelectedItemLabelGivenValue (value, data) {
    let label = getWithDefault(value, 'label', '')
    if (typeof selectedItem === 'string') {
      const foundItem = this._findSelectedItemGivenValue(value, this.get('options'))
      label = get(foundItem, 'label')
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
  observeSelectedItemLavelChange: observer('value', 'options.[]', '_isTyping', 'filter', function () {
    const selectedItem = this.get('selectedItemWithLabel')
    const filter = this.get('filter')
    const isTyping = this.get('_isTyping')
    if (!isEmpty(selectedItem)) {
      const label = get(selectedItem, 'label')
      if (!isEmpty(label) && isEmpty(filter) && !isTyping) this.set('filter', label)
    }
  }),
  actions: {
    onInput (filterValue) {
      const focused = this.get('_focused')

      this.setProperties({
        filter: filterValue,
        _isTyping: focused
      })
      this.send('filterOptions', filterValue)
    },
    onSelectedItem (selectedItem) {
      const filter = this._findSelectedItemLabelGivenValue(selectedItem, this.get('options'))
      this.setProperties({
        filter: filter,
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
        _isTyping: false
      })
      this.send('showErrorMessage')
    }
  }
})
