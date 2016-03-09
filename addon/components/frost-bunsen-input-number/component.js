import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import InputMixin from 'ember-frost-bunsen/mixins/input'
import layout from './template'

export default Ember.Component.extend(InputMixin, {
  classNames: [
    'frost-bunsen-input-number',
    'frost-field'
  ],

  layout,

  @readOnly
  @computed('state.value')
  /**
   * Text to render for value
   * @param {String|Object} value - value
   * @returns {String} text to render
   */
  renderValue: function (value) {
    return _.toString(value)
  },

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    'on-change': function (e) {
      if (!this.get('state.hasUserInteracted')) {
        this.set('state.hasUserInteracted', true)
      }

      const newValue = parseFloat(e.value || e.target.value)
      const oldValue = this.get('state.value')
      const onChange = this.get('on-change')

      if (newValue === oldValue) {
        return
      }

      if (onChange) {
        onChange({
          id: this.get('bunsenId'),
          value: newValue
        })
      }

      this.set('state.value', newValue)
    }
  }
})
