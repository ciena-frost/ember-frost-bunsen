import _ from 'lodash'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  classNames: ['frost-bunsen-property-chooser'],

  getDefaultProps () {
    return _.assign(this._super(), {
      useKey: null
    })
  },

  didReceiveAttrs () {
    const dependencies = this.get('model.dependencies')
    const useKey = this.get('useKey')
    const value = this.get('value')

    if (!value) {
      return
    }

    Object.keys(dependencies).forEach((key) => {
      if (key in value && useKey !== key) {
        this.set('useKey', key)
      }
    })
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
      const oldValue = this.get('useKey')

      if (onChange) {
        if (oldValue) {
          onChange(`${bunsenId}.${oldValue}`, '')
        }

        if (newValue) {
          onChange(`${bunsenId}.${newValue}`, 'selected')
        }
      }

      this.set('useKey', newValue)
    }
  }
})
