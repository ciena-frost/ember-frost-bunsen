import _ from 'lodash'
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import {doesModelContainRequiredField} from '../utils'

export default Component.extend(PropTypeMixin, {
  classNames: ['frost-bunsen-container'],

  propTypes: {
    bunsenId: PropTypes.string,
    cellConfig: PropTypes.EmberObject.isRequired,
    errors: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired,
    value: PropTypes.object.isRequired
  },

  getDefaultProps () {
    return {
      readOnly: false
    }
  },

  @readOnly
  @computed('cellConfig.container', 'store.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  config (containerId, containers) {
    const result = _.findWhere(containers, {id: containerId})

    if (!result || !result.rows) {
      return result
    }

    return result
  },

  // TODO: figure out why we can't use @readOnly
  @computed('model')
  /**
   * Determine whether or not container contains required inputs
   * @param {BunsenModel} model - bunsen model for form
   * @returns {Boolean} whether or not container contains required inputs
   */
  isRequired (model) {
    return doesModelContainRequiredField(model)
  }
})
