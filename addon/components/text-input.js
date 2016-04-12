import computed, {readOnly} from 'ember-computed-decorators'
import Input from './abstract-input'

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
  }
})
