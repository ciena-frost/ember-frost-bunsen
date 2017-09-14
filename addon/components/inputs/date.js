import moment from 'moment'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-date'

const DATE_FORMAT = 'YYYY-MM-DD'

export const deps = {
  moment
}

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNameBindings: ['value:frost-bunsen-has-value'],

  classNames: [
    'frost-bunsen-input-date',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  // == Functions ==============================================================

  init () {
    this._super(...arguments)

    const cellConfig = this.get('cellConfig')
    let defaultValue // default to undefined
    if (cellConfig.renderer.defaultToCurrentDate) {
      defaultValue = deps.moment().format(DATE_FORMAT)
    }
    this.set('currentValue', this.get('transformedValue') || defaultValue)
  },

  // == Actions ===============================================================

  actions: {
  }
})
