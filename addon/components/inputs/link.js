import {parseVariables} from 'bunsen-core/utils'
import computed from 'ember-computed-decorators'
import _ from 'lodash'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-link'

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-link',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @computed('cellConfig', 'formValue', 'value')
  linkLabel (cellConfig, formValue, value) {
    const rendererLabel = _.get(cellConfig, 'renderer.label')

    if (!rendererLabel) {
      return value
    }

    const bunsenId = this.get('bunsenId')
    const mutableFormValue = formValue ? formValue.asMutable({deep: true}) : {}

    return parseVariables(mutableFormValue, rendererLabel, bunsenId, true)
  },

  @computed('cellConfig', 'value')
  route (cellConfig) {
    return _.get(cellConfig, 'renderer.route')
  },

  @computed('cellConfig', 'formValue', 'value')
  url (cellConfig, formValue, value) {
    const rendererUrl = _.get(cellConfig, 'renderer.url')

    if (!rendererUrl) {
      return value
    }

    const bunsenId = this.get('bunsenId')
    const mutableFormValue = formValue ? formValue.asMutable({deep: true}) : {}

    return parseVariables(mutableFormValue, rendererUrl, bunsenId, true)
  },

  // == Functions ==============================================================

  formValueChanged (newValue) {
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return
    }

    const cellConfig = this.get('cellConfig')
    const rendererLabel = _.get(cellConfig, 'renderer.label')
    const rendererUrl = _.get(cellConfig, 'renderer.url')
    const labelContainsReferences = rendererLabel && rendererLabel.indexOf('${') !== -1
    const urlContainsReferences = rendererUrl && rendererUrl.indexOf('${') !== -1

    if (!labelContainsReferences && !urlContainsReferences) {
      return
    }

    this.set('formValue', newValue)
  },

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
  }
})
