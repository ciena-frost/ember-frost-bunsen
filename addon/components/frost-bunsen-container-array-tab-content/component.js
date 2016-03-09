import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'
import {getLabel} from '../utils'

export default Ember.Component.extend(PropTypeMixin, {
  layout,

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    index: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
    'on-change': PropTypes.func.isRequired,
    readOny: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  @readOnly
  @computed('cellConfig.item.renderer', 'store.renderers')
  /**
   * Get name of component for custom renderer
   * @param {String} renderer - custom renderer to use
   * @returns {String} name of custom renderer component
   */
  customRenderer: function (renderer) {
    return this.get(`store.renderers.${renderer}`)
  },

  @readOnly
  @computed('cellConfig.item.{container,label}', 'index', 'model', 'store.view.containers')
  /**
   * Get label text for item
   * @param {String} containerId - ID of container
   * @param {String} label - label
   * @param {Number} index - index of item in array
   * @param {BunsenModel} model - bunsen model for entire form
   * @param {BunsenContainer[]} containers - view containers
   * @returns {String} label
   */
  label: function (containerId, label, index, model, containers) {
    const itemContainerConfig = containerId ? _.find(containers, {id: containerId}) : null
    const itemId = itemContainerConfig ? itemContainerConfig.get('id') : ''
    const itemLabel = getLabel(label, model, itemId)
    return itemLabel ? `${itemLabel} ${index + 1}` : null
  },

  @readOnly
  @computed('bunsenId', 'store.formValue')
  /**
   * Get initial value for item
   * @param {String} bunsenId - bunsen ID
   * @returns {Object} initial value
   */
  initialValue: function (bunsenId) {
    return this.get(`store.formValue.${bunsenId}`)
  }
})
