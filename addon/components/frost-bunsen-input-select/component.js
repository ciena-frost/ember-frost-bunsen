import _ from 'lodash'
import Ember from 'ember'
import InputMixin from 'ember-frost-bunsen/mixins/input'
import ListInputMixin from 'ember-frost-bunsen/mixins/list-input'
import layout from './template'

export default Ember.Component.extend(InputMixin, ListInputMixin, {
  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],
  layout,
  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    onChange (e) {
      if (!this.get('state.hasUserInteracted')) {
        this.set('state.hasUserInteracted', true)
      }
      const newValue = e.value
      const oldValue = this.get('state.value')
      const onChange = this.get('onChange')
      // If value has not change then there is nothing to do
      if (newValue === oldValue) {
        return
      }
      if (onChange && _.isFunction(onChange)) {
        onChange({
          id: this.get('bunsenId'),
          value: newValue
        })
      }
      this.set('state.value', newValue)
    }
  }
})
