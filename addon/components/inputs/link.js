import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

import AbstractInput from './abstract-input'
import {getAttr, getOption} from 'ember-frost-bunsen/input-utils'
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
  @computed('cellConfig', 'value')
  route (cellConfig) {
    return _.get(cellConfig, 'renderer.route')
  },

  @readOnly
  @computed('renderErrorMessage')
  /**
   * Get class name for input element
   * @param {String} errorMessage - error message for input
   * @returns {String} input class name
   */
  valueClassName (errorMessage) {
    const classNames = ['frost-link']

    if (errorMessage) {
      classNames.push('error')
    }

    return classNames.join(' ')
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
    const newLinkLabel = newLabel || 'Link'

    if (this.get('linkLabel') !== newLinkLabel) {
      props.linkLabel = newLinkLabel
    }

    if (this.get('url') !== newUrl) {
      props.url = newUrl
    }

    if (Object.keys(props).length !== 0) {
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
