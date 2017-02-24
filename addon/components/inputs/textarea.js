import Ember from 'ember'
const {get, merge, typeOf} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-textarea'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-textarea',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig')
  textareaOptions (cellConfig) {
    const options = {}
    const cols = get(cellConfig, 'renderer.cols')
    const rows = get(cellConfig, 'renderer.rows')

    if (cols) {
      options.cols = cols
    }

    if (rows) {
      options.rows = rows
    }

    if (typeOf(cellConfig.renderer.options) === 'object') {
      return merge(options, cellConfig.renderer.options)
    }

    return options
  }
})
