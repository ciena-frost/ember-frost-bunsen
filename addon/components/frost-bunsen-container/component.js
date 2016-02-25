import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'
import {doesModelContainRequiredField} from '../utils'

export default Ember.Component.extend(PropTypesMixin, {
  classNames: ['frost-bunsen-container'],
  layout,

  propTypes: {
    bunsenId: PropTypes.string,
    cellConfig: PropTypes.EmberObject.isRequired,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false,

  @readOnly
  @computed('cellConfig.container', 'store.view.containers')
  /**
   * Get definition for current container
   * @param {String} containerId - ID of current container
   * @param {BunsenContainer[]} containers - list of container definitions
   * @returns {BunsenContainer} current container definition
   */
  config: function (containerId, containers) {
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
  isRequired: function (model) {
    return doesModelContainRequiredField(model)
  }
})
