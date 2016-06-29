import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export const helpers = {
  validateValues (values, type) {
    if (!_.isArray(values)) {
      throw new Error(`In order to use a toggle input with type ${type} enum must be present`)
    }
  }
}

export default AbstractInput.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: [
    'frost-bunsen-input-button-group',
    'frost-field'
  ],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('bunsenModel.{enum,type}', 'value')
  activeIndex (values, type, activeValue) {
    if (type === 'boolean') {
      return [true, false].indexOf(activeValue)
    }

    return values.indexOf(activeValue)
  },

  @readOnly
  @computed('bunsenModel.{enum,type}')
  options (values, type) {
    switch (type) {
      case 'boolean':
        return ['On', 'Off']

      case 'integer':
      case 'number':
        helpers.validateValues(values, type)
        return values

      case 'string':
        helpers.validateValues(values, type)
        return values.map((value) => Ember.String.capitalize(value))

      default:
        throw new Error(`Toggle input cannot be used with type ${type}`)
    }
  },

  @readOnly
  @computed('cellConfig.properties.size')
  size (size) {
    return size || 'medium'
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  /**
   * Get selected value based on selected index
   * @param {Number} selectedIndex - index of selected option
   * @returns {Boolean|Number|String} selected value
   */
  parseValue (selectedIndex) {
    const type = this.get('bunsenModel.type')
    const values = this.get('bunsenModel.enum')

    if (type === 'boolean') {
      return selectedIndex === 0
    }

    return values[selectedIndex]
  }

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================
})
