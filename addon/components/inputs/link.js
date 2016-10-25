import {parseVariables} from 'bunsen-core/utils'
import Ember from 'ember'
const {get} = Ember
import computed from 'ember-computed-decorators'
import _ from 'lodash'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-link'

function getOption (attrs, optionName, formValue) {
  if (!attrs) {
    return undefined
  }

  const bunsenId = get(attrs, 'bunsenId.value')
  const configOption = get(attrs, `cellConfig.value.renderer.${optionName}`)
  const value = get(attrs, 'value.value')

  if (!configOption) {
    return value
  }

  const mutableFormValue = formValue ? formValue.asMutable({deep: true}) : {}

  return parseVariables(mutableFormValue, configOption, bunsenId, true)
}

export default AbstractInput.extend({
  // == Component Properties ===================================================

  classNames: [
    'frost-bunsen-input-link',
    'frost-field'
  ],

  layout,

  // == Computed Properties ====================================================

  @computed('cellConfig', 'value')
  route (cellConfig) {
    return _.get(cellConfig, 'renderer.route')
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
  },

  didReceiveAttrs ({newAttrs, oldAttrs}) {
    const formValue = this.get('formValue')
    const props = {}
    const newLabel = getOption(newAttrs, 'label', formValue)
    const newUrl = getOption(newAttrs, 'url', formValue)
    const oldLabel = getOption(oldAttrs, 'label', formValue)
    const oldUrl = getOption(oldAttrs, 'url', formValue)

    if (newLabel !== oldLabel) {
      props.linkLabel = newLabel
    }

    if (newUrl !== oldUrl) {
      props.url = newUrl
    }

    if (Object.keys(props) !== 0) {
      this.setProperties(props)
    }
  },

  // == Actions ===============================================================

  actions: {
    handleClick (e) {
      // Prevent link click event from bubbling which causes problems when it is
      // rendered in certain parent components such as a frost-list
      e.stopPropagation()
    }
  }

})
