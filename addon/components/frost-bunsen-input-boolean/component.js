import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import layout from './template'
import InputMixin from 'ember-frost-bunsen/mixins/input'

export default Ember.Component.extend(InputMixin, {
  classNames: [
    'frost-bunsen-input-boolean',
    'frost-field'
  ],

  layout,

  @readOnly
  @computed('state.value')
  /**
   * Text to render for value
   * @param {String|Boolean} value - value
   * @returns {String} text to render
   */
  renderValue: function (value) {
    if (_.isBoolean(value)) {
      value = (value) ? 'true' : 'false'
    }

    return value
  },

  actions: {
    /**
     * Handle user toggling state
     */
    onChange: function () {
      this.set('state.hasUserInteracted', true)

      const value = !this.get('state.value')
      const onChange = this.get('onChange')

      if (onChange) {
        onChange({
          id: this.get('bunsenId'),
          value
        })
      }

      this.set('state.value', value)
    }
  }
})
