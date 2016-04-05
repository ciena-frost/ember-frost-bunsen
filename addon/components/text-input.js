import computed, {readOnly} from 'ember-computed-decorators'
import Input from './input-base'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Input.extend({
  classNames: [
    'frost-bunsen-input-text',
    'frost-field'
  ],

  // We totally don't care about this cause it's view schema
  @readOnly
  @computed('cellConfig.properties.type')
  inputType (type) {
    return type || 'text'
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
      const newValue = e.value
      const onChange = this.get('onChange')
      if (onChange) {
        onChange(this.get('bunsenId'), newValue)
      }
    }
  }
})
