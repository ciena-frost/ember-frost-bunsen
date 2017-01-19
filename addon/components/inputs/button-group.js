import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-button-group'

export const helpers = {
  validateValues (values, type) {
    if (!_.isArray(values)) {
      throw new Error(`In order to use a button-group renderer with type ${type} enum must be present`)
    }
  }
}

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-button-group',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

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
        throw new Error(`button-group renderer cannot be used with type ${type}`)
    }
  },

  @readOnly
  @computed('cellConfig')
  size (cellConfig) {
    return _.get(cellConfig, 'renderer.size') || 'medium'
  },

  // == Functions ==============================================================

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
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event data
     */
    handleChange (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = this.parseValue(e)

      this.getTemplateVariables(newValue)

      const transforms = this.get('cellConfig.transforms.write')
      const transformedNewValue = this.applyTransforms(newValue, transforms)
      const oldValue = this.get('value')
      const updatedValue = _.isEqual(transformedNewValue, oldValue) ? null : transformedNewValue

      this.onChange(bunsenId, updatedValue)
    }
  }
})
