import _ from 'lodash'
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

const PLACEHOLDER = '—'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-static',
    'frost-field'
  ],

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig.placeholder', 'value')
  renderValue (placeholder, value) {
    if (_.isBoolean(value)) {
      return value ? 'true' : 'false'
    }

    if ([null, undefined, ''].indexOf(value) !== -1) {
      return placeholder || PLACEHOLDER
    }

    return value
  }
})
