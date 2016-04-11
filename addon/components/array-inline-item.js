import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {getLabel} from '../utils'

export default Component.extend(PropTypeMixin, {
  classNames: ['item-wrapper'],

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    readOny: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.object.isRequired
  },

  @readOnly
  @computed('cellConfig.item.renderer', 'store.renderers')
  /**
   * Get name of component for custom renderer
   * @param {String} renderer - custom renderer to use
   * @returns {String} name of custom renderer component
   */
  customRenderer (renderer) {
    return this.get(`store.renderers.${renderer}`)
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`

    if (_.isEmpty(errors)) {
      return null
    }

    const errorMessages = errors[bunsenId]
    return _.isEmpty(errorMessages) ? null : errorMessages.join('/n')
  },

  // FIXME: this should be read only
  @computed('value')
  renderValue (value) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`
    return _.get(value, bunsenId)
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
  label (containerId, label, index, model, containers) {
    const itemContainerConfig = containerId ? _.find(containers, {id: containerId}) : null
    const itemId = itemContainerConfig ? itemContainerConfig.get('id') : ''
    const itemLabel = Ember.String.singularize(getLabel(label, model, itemId))
    return itemLabel ? `${itemLabel} ${index + 1}` : null
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
