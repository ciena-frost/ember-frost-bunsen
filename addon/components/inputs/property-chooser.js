import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-property-chooser'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-property-chooser',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig')
  data (cellConfig) {
    return _.get(cellConfig, 'renderer.choices') || []
  },

  @readOnly
  @computed('bunsenModel.dependencies', 'value')
  useKey (dependencies, value) {
    if (value) {
      for (let key in dependencies) {
        if (dependencies.hasOwnProperty(key) && key in value) {
          return key
        }
      }
    }

    return null
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle user updating selected item
     * @param {Array<String>} selected - selected values
     */
    onChange (selected) {
      if (selected.length === 0) {
        return
      }

      const bunsenId = this.get('bunsenId')
      const newValue = selected[0]
      const onChange = this.get('onChange')
      const oldValue = this.get('useKey')

      if (onChange) {
        if (oldValue) {
          onChange(`${bunsenId}.${oldValue}`, '')
        }

        if (newValue) {
          onChange(`${bunsenId}.${newValue}`, 'selected')
        }
      }
    }
  }
})
