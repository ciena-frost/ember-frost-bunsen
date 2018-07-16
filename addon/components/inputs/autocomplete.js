import SelectInput from './select'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'
import Ember from 'ember'
const {isEmpty} = Ember
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
      _emptyFilter: true,
      filter: ''
    }
  },
  @readOnly
  @computed('bunsenModel.{modelType,endpoint}', 'updateItems.isRunning', '_emptyFilter')
  asyncLoading (modelType, endpoint, isUpdateItemsRunning, emptyFilter) {
    const isAsyncGet = modelType || endpoint
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
