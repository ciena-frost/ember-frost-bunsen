import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: ['frost-bunsen-property-chooser'],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

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

  // ==========================================================================
  // Functions
  // ==========================================================================

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================

  actions: {
    /**
     * Handle user updating selected item
     * @param {Event} e - event
     */
    onChange (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = e.target.value
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
