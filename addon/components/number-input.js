import _ from 'lodash'
import computed from 'ember-computed-decorators'
import Input from './abstract-input'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Input.extend({
  classNames: [
    'frost-bunsen-input-number',
    'frost-field'
  ],

  @computed('value')
  /**
   * Text to render for value
   * @returns {String} text to render
   */
  renderValue () {
    return _.toString(this.get('value'))
  },

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    onChange (e) {
      if (!this.get('state.hasUserInteracted')) {
        this.set('state.hasUserInteracted', true)
      }
      const newValue = parseFloat(e.value || e.target.value)
      const onChange = this.get('onChange')
      if (onChange) {
        onChange(this.get('bunsenId'), newValue)
      }
    }
  }
})
