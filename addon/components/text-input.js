import _ from 'lodash'
import Ember from 'ember'
const {deprecate} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import AbstractInput from './abstract-input'

export default AbstractInput.extend({
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  // ==========================================================================
  // Properties
  // ==========================================================================

  classNames: [
    'frost-bunsen-input-text',
    'frost-field'
  ],

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  // We totally don't care about this cause it's view schema
  @readOnly
  @computed('cellConfig.properties.type')
  inputType (type) {
    return type || 'text'
  },

  // ==========================================================================
  // Functions
  // ==========================================================================

  didReceiveAttrs ({newAttrs}) {
    const typeIsPassword = _.get(newAttrs, 'cellConfig.value.properties.type') === 'password'

    deprecate(
      'using text renderer with type password has been deprecated in favor of using the password renderer',
      !typeIsPassword, // When false deprecation is displayed
      {
        id: 'ember-frost-bunsen.deprecatation.text-input-as-password',
        until: '7.0',
        url: 'http://ciena-frost.github.io/ember-frost-bunsen/#/renderers'
      }
    )
  }

  // ==========================================================================
  // Events
  // ==========================================================================

  // ==========================================================================
  // Actions
  // ==========================================================================
})
