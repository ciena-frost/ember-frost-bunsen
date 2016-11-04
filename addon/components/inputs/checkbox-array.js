import _ from 'lodash'
import AbstractInput from './abstract-input'
import computed, {readOnly} from 'ember-computed-decorators'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-checkbox-array'
import Ember from 'ember'
const {get} = Ember

export const helpers = {
  validateChoices (choices, meta) {
    if (!Ember.isEmpty(choices) && !Ember.isEmpty(meta)) {
      throw new Error('Use either choices for enum driven or meta for data driven, not both')
    }
  }
}

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-checkbox-array',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  selected: {},

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
    const choices = _.get(cellConfig, 'renderer.choices') || []
    const meta = _.get(cellConfig, 'renderer.meta') || []

    helpers.validateChoices(choices, meta)

    // Initialize selected for each model property
    this.get('selected')[this.get('bunsenId')] = []

    if (Ember.isEmpty(meta)) {
      return items.map((item) => {
        for (var i = 0; i < choices.length; i++) {
          if (choices[i].label === item) {
            return { label: item, value: choices[i].value }
          }
        }
        return { label: item, value: item }
      })
    } else {
      return items.map((item) => {
        for (var i = 0; i < meta.length; i++) {
          if (meta[i].datum === item) {
            return { label: meta[i].label, value: meta[i].value }
          }
        }
        return { label: item, value: item }
      })
    }
  },

  // == Functions ==============================================================
  /**
   * Convert value to appropriate format for template
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    // Get the selection for the correct model property
    var selected = this.get('selected')[this.get('bunsenId')]

    if (data.value) {
      selected.push(data.id)
    } else {
      var index = selected.indexOf(data.value)
      selected.splice(index, 1)
    }
    return selected
  }
})
