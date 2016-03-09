import Ember from 'ember'
import InputMixin from 'ember-frost-bunsen/mixins/input'
import layout from './template'

export default Ember.Component.extend(InputMixin, {
  classNames: ['frost-bunsen-property-chooser'],
  layout,

  actions: {
    /**
     * Handle user updating selected item
     * @param {Event} e - event
     */
    'on-change': function (e) {
      const bunsenId = this.get('bunsenId')
      const newValue = e.target.value
      const onChange = this.get('on-change')
      const oldValue = this.get('state.value')

      if (onChange) {
        if (oldValue) {
          onChange({
            id: `${bunsenId}.${oldValue}`,
            value: ''
          })
        }

        if (newValue) {
          onChange({
            id: `${bunsenId}.${newValue}`,
            value: 'selected'
          })
        }
      }

      this.set('state.value', newValue)
    }
  }
})
