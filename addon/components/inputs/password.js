
import AbstractInput from './abstract-input'
import Ember from 'ember'
import computed, {alias, readOnly} from 'ember-computed-decorators'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-password'

const {get, merge} = Ember

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-password',
    'frost-field'
  ],

  layout,

  // == State Properties =======================================================

  getDefaultProps () {
    return {
      required: false,
      revealed: false,
      showErrorMessage: false
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig')
  options (cellConfig) {
    const options = get(cellConfig, 'renderer.options')
    return merge({revealable: true}, options)
  },

  @readOnly
  @alias('options.revealable')
  revealable: null,

  @readOnly
  @computed('revealed')
  revealText (revealed) {
    return revealed ? 'Hide' : 'Show'
  },

  @readOnly
  @computed('revealed', 'transformedValue')
  staticValue (revealed, value) {
    return revealed ? value : '************'
  },

  // == Actions ==================================================================

  actions: {
    toggleRevealed () {
      this.toggleProperty('revealed')
    }
  }
})
