import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'
import Input from './abstract-input'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Input.extend({
  classNames: [
    'frost-bunsen-input-boolean',
    'frost-field'
  ],

  @readOnly
  @computed('value')
  /**
   * Text to render for value
   * @param {Boolean|String} value - value
   * @returns {Boolean} text to render
   */
  checked (value) {
    if (_.isString(value)) {
      return value === 'true'
    }

    return value
  }
})
