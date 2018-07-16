import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'
import Ember from 'ember'
const {isEmpty} = Ember
import computed, {or, readOnly} from 'ember-computed-decorators'

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
      _emptyFilter: true,
      filter: ''
    }
  },
  @readOnly
  @or('bunsenModel.modelType', 'bunsenModel.endpoint') isAsyncGet, // eslint-disable-line no-undef

  @readOnly
  @computed('isAsyncGet', 'updateItems.isRunning', '_emptyFilter')
  asyncLoading (isAsyncGet, isUpdateItemsRunning, emptyFilter) {
    if (isAsyncGet) {
      return emptyFilter || isUpdateItemsRunning
    }
    return false
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
      this.set('_emptyFilter', isEmpty(filterValue))
      this.send('filterOptions', filterValue)
    }
  }
})
