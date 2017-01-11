import {utils} from 'bunsen-core'
const {getLabel} = utils
import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'

import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-array-tab-content'

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNames: ['frost-bunsen-array-tab-content'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object.isRequired,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formDisabled: PropTypes.bool,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    readOny: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    showAllErrors: PropTypes.bool,
    unregisterForFormValueChanges: PropTypes.func,
    value: PropTypes.object.isRequired
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig', 'renderers')
  /**
   * Get name of component for custom renderer
   * @param {Object} cellConfig - cell config
   * @returns {String} name of custom renderer component
   */
  customRenderer (cellConfig) {
    const renderer = _.get(cellConfig, 'arrayOptions.itemCell.renderer.name')
    return this.get(`renderers.${renderer}`)
  },

  @readOnly
  @computed('errors')
  errorMessage (errors) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`

    if (_.isEmpty(errors)) {
      return null
    }

    const errorMessages = errors[bunsenId]
    debugger
    return _.isEmpty(errorMessages) ? null : Ember.String.htmlSafe(errorMessages.join('<br>'))
  },

  @readOnly
  @computed('value')
  renderValue (value) {
    const bunsenId = `${this.get('bunsenId')}.${this.get('index')}`
    return value[bunsenId]
  },

  @readOnly
  @computed(
    'cellConfig', 'index', 'bunsenModel', 'bunsenView.cellDefinitions'
  )
  /**
   * Get label text for item
   * @param {Object} cellConfig - cell config
   * @param {Number} index - index of item in array
   * @param {BunsenModel} bunsenModel - bunsen model for entire form
   * @param {BunsenCell[]} cellDefinitions - view cells
   * @returns {String} label
   */
  label (cellConfig, index, bunsenModel, cellDefinitions) {
    const cellId = _.get(cellConfig, 'arrayOptions.itemCell.extends')
    const label = _.get(cellConfig, 'arrayOptions.itemCell.label')
    const itemCellConfig = cellId ? cellDefinitions[cellId] : null
    const itemId = itemCellConfig ? cellId : ''
    const itemLabel = getLabel(label, bunsenModel, itemId)
    return itemLabel ? `${itemLabel} ${index + 1}` : null
  },

  @readOnly
  @computed('cellConfig')
  itemCell (cellConfig) {
    return _.get(cellConfig, 'arrayOptions.itemCell') || {}
  }
})
