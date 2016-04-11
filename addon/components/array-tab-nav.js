import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from '../utils'

export default Component.extend(PropTypeMixin, {
  tagName: 'li',

  propTypes: {
    cellConfig: PropTypes.EmberObject.isRequired,
    index: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    store: PropTypes.EmberObject.isRequired
  },

  @readOnly
  @computed('cellConfig.item.{container,label}', 'index', 'model', 'store.view.containers')
  /**
   * Get title for tab
   * @param {String} containerId - ID of container
   * @param {String} label - label
   * @param {Number} index - index of item in array
   * @param {BunsenModel} model - bunsen model for entire form
   * @param {BunsenContainer[]} containers - view containers
   * @returns {String} tab title
   */
  title (containerId, label, index, model, containers) {
    const itemContainerConfig = containerId ? _.find(containers, {id: containerId}) : null
    const itemId = itemContainerConfig ? itemContainerConfig.get('id') : ''
    const itemLabel = getLabel(label, model, itemId)
    return itemLabel ? `${itemLabel} ${index + 1}` : `${index + 1}`
  },

  actions: {
    /**
     * When user wants to remove item
     */
    onRemove () {
      const index = this.get('index')
      const onRemove = this.get('onRemove')

      if (onRemove) {
        onRemove(index)
      }
    }
  }
})
