import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-password'

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
  @computed('revealed')
  revealIcon (revealed) {
    return revealed ? 'hide' : 'show'
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
