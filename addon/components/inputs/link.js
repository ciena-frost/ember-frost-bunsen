import {parseVariables} from 'bunsen-core/utils'
import Ember from 'ember'
const {get} = Ember
import computed from 'ember-computed-decorators'
import _ from 'lodash'
import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-link'

function getAttr (attrs, name) {
  if (!attrs) {
    return undefined
  }

  if (name.indexOf('.') === -1) {
    return get(attrs, `${name}.value`)
  }

  const segments = name.split('.')
  const firstSegment = segments.splice(0, 1)
  const remainingPath = segments.join('.')

  return get(attrs, `${firstSegment}.value.${remainingPath}`)
}

function getOption (attrs, optionName, formValue, fallback = '') {
  if (!attrs) {
    return undefined
  }

  const bunsenId = getAttr(attrs, 'bunsenId')
  const configOption = getAttr(attrs, `cellConfig.renderer.${optionName}`)
  const value = getAttr(attrs, 'value')

  if (!configOption) {
    return value
  }

  const mutableFormValue = formValue ? formValue.asMutable({deep: true}) : {}

  return parseVariables(mutableFormValue, configOption, bunsenId, true) || fallback
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
    const newDefaultLabel = getAttr(newAttrs, 'cellConfig.renderer.defaultLabel')
    const newLabel = getOption(newAttrs, 'label', formValue, newDefaultLabel)
    const newUrl = getOption(newAttrs, 'url', formValue)
    const oldDefaultLael = getAttr(oldAttrs, 'cellConfig.renderer.defaultLabel')
    const oldLabel = getOption(oldAttrs, 'label', formValue, oldDefaultLael)
    const oldUrl = getOption(oldAttrs, 'url', formValue)

    if (newLabel !== oldLabel) {
      props.linkLabel = newLabel || 'Link'
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
