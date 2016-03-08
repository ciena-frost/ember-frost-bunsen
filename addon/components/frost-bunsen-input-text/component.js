import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'
import FrostComponent from 'ember-frost-component'

import InputMixin from 'ember-frost-bunsen/mixins/input'
import layout from './template'

export default FrostComponent.extend(InputMixin, {
  classNames: [
    'frost-bunsen-input-text',
    'frost-field'
  ],
  layout,

  @readOnly
  @computed('cellConfig.properties.type')
  inputType (type) {
    return type || 'text'
  },

  // TODO: figure out why we can't use @readOnly (frost-text updating value property internally?)
  @computed('cellConfig.placeholder', 'state.value')
  /**
   * Text to render for value
   * @param {String} placeholder - placeholder text
   * @param {String|Boolean} value - value
   * @returns {String} text to render
   */
  renderValue: function (placeholder, value) {
    if (_.isBoolean(value)) {
      value = (value) ? 'true' : 'false'
    }

    if (value === '') {
      value = placeholder
    }

    return value
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

      const newValue = e.value
      const oldValue = this.get('state.value')
      const onChange = this.get('on-change')

      // If value has not change then there is nothing to do
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
