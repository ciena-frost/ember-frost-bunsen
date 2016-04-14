import Ember from 'ember'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  classNames: ['frost-bunsen-property-chooser'],

  init () {
    this._super(...arguments)
    this.set('state', Ember.Object.create({
      value: null
    }))
  },

  actions: {
    /**
     * Handle user updating selected item
     * @param {Event} e - event
     */
    onChange (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = e.target.value
      const onChange = this.get('onChange')
      const oldValue = this.get('state.value')

      if (onChange) {
        if (oldValue) {
          onChange(`${bunsenId}.${oldValue}`, '')
        }

        if (newValue) {
          onChange(`${bunsenId}.${newValue}`, 'selected')
        }
      }

      this.set('state.value', newValue)
    }
  }
})
