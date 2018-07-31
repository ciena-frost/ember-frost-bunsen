import {utils} from 'bunsen-core'
const {parseVariables} = utils
import Ember from 'ember'
const {get} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

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

  @readOnly
  @computed('cellConfig')
  defaultLabel (cellConfig) {
    return (
      get(cellConfig, 'renderer.defaultLabel') ||
      get(cellConfig, 'renderer.options.defaultLabel')
    )
  },

  @readOnly
  @computed('bunsenId', 'defaultLabel', 'formValue', 'linkLabel', 'value')
  dereferencedLinkLabel (bunsenId, defaultLabel, formValue, linkLabel, value) {
    if (!linkLabel) return value
    return (
      parseVariables(formValue, linkLabel, bunsenId, true) ||
      defaultLabel ||
      'Link'
    )
  },

  @readOnly
  @computed('bunsenId', 'formValue', 'url', 'value')
  dereferencedUrl (bunsenId, formValue, url, value) {
    if (!url) return value
    return parseVariables(formValue, url, bunsenId, true) || ''
  },

  @readOnly
  @computed('cellConfig')
  linkLabel (cellConfig) {
    return (
      get(cellConfig, 'renderer.label') ||
      get(cellConfig, 'renderer.options.label')
    )
  },

  @readOnly
  @computed('cellConfig', 'value')
  route (cellConfig) {
    return get(cellConfig, 'renderer.route')
  },

  @readOnly
  @computed('cellConfig')
  url (cellConfig) {
    return (
      get(cellConfig, 'renderer.url') ||
      get(cellConfig, 'renderer.options.url')
    )
  },

  @readOnly
  @computed('renderErrorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  valueClassName (errorMessage) {
    const classNames = ['frost-link', 'inline']

    if (errorMessage) {
      classNames.push('error')
    }

    return classNames.join(' ')
  },

  // == Functions ==============================================================

  formValueChanged (newValue) {
    const cellConfig = this.get('cellConfig')
    const rendererLabel = get(cellConfig, 'renderer.label')
    const rendererUrl = get(cellConfig, 'renderer.url')
    const labelContainsReferences = rendererLabel && rendererLabel.indexOf('${') !== -1
    const urlContainsReferences = rendererUrl && rendererUrl.indexOf('${') !== -1

    if (!labelContainsReferences && !urlContainsReferences) return

    this.set('formValue', newValue)
  },

  // == Events ================================================================

  init () {
    this._super(...arguments)
    this.registerForFormValueChanges(this)
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
