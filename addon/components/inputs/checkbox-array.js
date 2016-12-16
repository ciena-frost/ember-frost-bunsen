import _ from 'lodash'
import AbstractInput from './abstract-input'
import computed, {readOnly} from 'ember-computed-decorators'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-checkbox-array'
import Ember from 'ember'
const {get, isEmpty} = Ember

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-checkbox-array',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  getDefaultProps () {
    return {
      selected: []
    }
  },

  // == Computed Properties ====================================================
  @readOnly
  @computed('cellConfig')
  size (cellConfig) {
    return _.get(cellConfig, 'renderer.size') || 'medium'
  },

  @readOnly
  @computed('bunsenModel', 'cellConfig')
  options (bunsenModel, cellConfig) {
    const items = get(bunsenModel, 'items.enum') || []
    const selectedValues = get(cellConfig, 'renderer.selectedValues') || []
    this.set('selected', selectedValues)
    const data = get(cellConfig, 'renderer.data') || []

    var options = {}

    if (isEmpty(data)) {
      options = items.map((item) => {
        return { value: item, label: item, checked: selectedValues.indexOf(item) > -1 }
      })
    } else {
      options = data.map((item) => {
        return { value: item.value, label: item.label || item.value, checked: selectedValues.indexOf(item.value) > -1 }
      })
    }
    return options
  },

  // == Functions ==============================================================
  /**
   * Convert value to appropriate format for template
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    var selected = this.get('selected')
    if (data.value) {
      selected.push(data.id)
    } else {
      var index = selected.indexOf(data.id)
      selected.splice(index, 1)
    }
    return selected
  }
})
