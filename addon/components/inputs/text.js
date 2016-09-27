import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-text'
const {run} = Ember

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
  @computed('cellConfig')
  inputType (cellConfig) {
    return _.get(cellConfig, 'renderer.type') || 'text'
  }
})
