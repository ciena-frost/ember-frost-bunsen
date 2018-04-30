import Ember from 'ember'
const {run} = Ember
import _ from 'lodash'

import DropdownInput from './dropdown-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-autocomplete'

const DEBOUNCE_INTERVAL = 300

export default DropdownInput.extend({
  // == Component Properties ===================================================
  classNames: [
    'frost-bunsen-input-autocomplete',
    'frost-field'
  ],

  layout,

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {String} data - value to parse
   * @returns {String} parsed value
   */
  parseValue (data) {
    return data
  },

  runUpdateItems (options) {
    this.get('updateItems').perform(options)
  },

  // == Actions ================================================================

  actions: {
    /**
     * perform a filter on the widget
     * @param  {String} filter the filter text
     */
    filterOptions (filter) {
      const value = this.get('formValue')
      run.debounce(this, this.runUpdateItems, {value, filter, keepCurrentValue: false}, DEBOUNCE_INTERVAL)
    }
  }
})
