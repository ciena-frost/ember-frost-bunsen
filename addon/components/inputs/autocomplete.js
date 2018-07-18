import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'
import Ember from 'ember'
const {A, isEmpty} = Ember
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
      filter: ''
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
      return A(options).findBy('value', value) || value
    }

    return value
  },
  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {String} data - value to parse
   * @returns {String} parsed value
   */
  parseValue (data) {
    return data
  },
  actions: {
    checkIfEmptyfilter (filterValue) {
      this.set('filter', filterValue)
      this.send('filterOptions', filterValue)
    },
    onSelectedItem (selectedItem) {
      this.set('filter', '')
      this.send('handleChange', selectedItem)
    }
  }
})
