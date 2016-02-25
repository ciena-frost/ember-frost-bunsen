import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypesMixin, {PropTypes} from 'ember-frost-bunsen/mixins/prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypesMixin, {
  classNames: ['frost-bunsen-input'],
  layout,

  // Attributes
  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    cellConfig: PropTypes.EmberObject,
    initialValue: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string
    ]),
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    store: PropTypes.EmberObject.isRequired
  },

  // Defaults
  readOnly: false,
  required: false,

  @readOnly
  @computed('bunsenId', 'cellConfig', 'store.formValue')
  /**
   * Whether or not input's dependency is met
   * @param {String} bunsenId - bunsen ID for input
   * @param {BunsenCell} cell - cell configuration for input
   * @param {Object} formValue - current value of form
   * @returns {Boolean} whether or not dependency is met
   */
  isDependencyMet: function (bunsenId, cell, formValue) {
    const dependencyId = bunsenId.replace(cell.model, cell.dependsOn)
    const dependencyValue = _.get(formValue, dependencyId)
    return (dependencyValue !== undefined)
  },

  @readOnly
  @computed('cellConfig.dependsOn', 'isDependencyMet')
  /**
   * Whether or not component should render if it is a dependency
   * @param {String} dependsOn - what input depends
   * @param {Boolean} isDependencyMet - whether or not dependency is met
   * @returns {Boolean} whether or not component should render if it is a dependency
   */
  shouldRender: function (dependsOn, isDependencyMet) {
    return !dependsOn || isDependencyMet
  },

  /**
   * Get name of component helper
   * @param {String} type - type of input to render
   * @param {Boolean} shouldRender - whether or not input should render if it is a dependency
   * @returns {String} name of component helper to use for input
   */
  getRealInputComponent: function (type, shouldRender) {
    switch (type) {
      case 'string':
        return 'frost-bunsen-input-text'
      case 'number':
        return 'frost-bunsen-input-number'
      case 'boolean':
        return 'frost-bunsen-input-boolean'
      default:
        if (shouldRender) {
          throw new Error('Only "string", "number", or "boolean" fields are currently supported.')
        }
    }
  },

  @readOnly
  @computed('cellConfig.renderer', 'model.{editable,type}', 'readOnly', 'shouldRender', 'store.renderers')
  /**
   * Get name of component helper
   * @param {String} renderer - custom renderer to use
   * @param {Boolean} editable - whether or not input should be editable (defined in model)
   * @param {String} type - type of input to render
   * @param {Boolean} readOnly - whether or not input should be rendered as read only
   * @param {Boolean} shouldRender - whether or not input should render if it is a dependency
   * @param {Object} renderers - key value pairs mapping custom renderers to component helper names
   * @returns {String} name of component helper to use for input
   */
  inputName: function (renderer, editable, type, readOnly, shouldRender, renderers) {
    if (renderer) {
      return renderers[renderer]
    }

    if (readOnly || editable === false) {
      return 'frost-bunsen-input-static'
    }

    return this.getRealInputComponent(type, shouldRender)
  }
})
