import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-text'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-text',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  // We totally don't care about this cause it's view schema
  @readOnly
  @computed('cellConfig.renderer.type')
  inputType (type) {
    return type || 'text'
  }
})
