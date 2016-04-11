import Input from './abstract-input'

export default Input.extend({
  classNames: ['frost-bunsen-property-chooser'],

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
