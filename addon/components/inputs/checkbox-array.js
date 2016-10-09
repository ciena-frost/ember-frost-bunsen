import _ from 'lodash'
import AbstractInput from './abstract-input'
import computed, {readOnly} from 'ember-computed-decorators'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-checkbox-array'
import Ember from 'ember'
const {get} = Ember

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-checkbox-array',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  selected: [],

  // == Computed Properties ====================================================
  @readOnly
  @computed('cellConfig')
  size (cellConfig) {
    return _.get(cellConfig, 'renderer.size') || 'medium'
  },

  @readOnly
  @computed('bunsenModel')
  options (bunsenModel) {
    const items = get(bunsenModel, 'items.enum') || []

    return items.map((value) => {
      return { value }
    })
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
      var index = selected.indexOf(data.value)
      selected.splice(index, 1)
    }
    return selected
  }
})
