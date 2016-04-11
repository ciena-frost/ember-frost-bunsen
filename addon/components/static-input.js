import _ from 'lodash'
import Input from './abstract-input'

const PLACEHOLDER = '—'

export const defaultClassNames = {
  inputWrapper: 'left-input',
  labelWrapper: 'left-label'
}

export default Input.extend({
  classNames: [
    'frost-bunsen-input-static',
    'frost-field'
  ],

  getRenderValue () {
    const placeholder = this.get('cellConfig.placeholder')
    let value = this.get('value')
    if (_.isBoolean(value)) {
      value = (value) ? 'true' : 'false'
    } else if (value === '') {
      value = placeholder || PLACEHOLDER
    }
    return value
  },

  didReceiveAttrs ({newAttrs, oldAttrs}) {
    this._super()
    const newValue = _.get(newAttrs, 'value.value')
    const oldValue = _.get(oldAttrs, 'value.value')

    if (!_.isEqual(newValue, oldValue)) {
      this.set('renderValue', this.getRenderValue())
    }
  }
})
