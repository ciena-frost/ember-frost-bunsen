import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import InputMixin from 'ember-frost-bunsen/mixins/input'
import layout from './template'

const PLACEHOLDER = '—'

export default Ember.Component.extend(InputMixin, {
  classNames: [
    'frost-bunsen-input-static',
    'frost-field'
  ],

  layout,

  @readOnly
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
      value = placeholder || PLACEHOLDER
    }

    return value
  }
})
