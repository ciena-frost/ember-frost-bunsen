import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import getOwner from 'ember-getowner-polyfill'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import _ from 'lodash'
import {getRendererComponentName, validateRenderer} from '../utils'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-wrapper'

export default Component.extend(PropTypeMixin, {
  // == Component Properties ===================================================

  layout,
  tagName: '',

  // == State Properties =======================================================

  propTypes: {
    bunsenId: PropTypes.string.isRequired,
    bunsenModel: PropTypes.object,
    bunsenView: PropTypes.object.isRequired,
    cellConfig: PropTypes.object,
    formDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    registerForFormValueChanges: PropTypes.func,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    required: PropTypes.bool,
    showAllErrors: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.null,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string
    ])
  },

  getDefaultProps () {
    return {
      readOnly: false,
      required: false
    }
  },

  didReceiveAttrs ({oldAttrs, newAttrs}) {
  },

  didRender () {
    console.log('didRender wrapper')
  },
  // == Computed Properties ====================================================

  @readOnly
  @computed('cellConfig', 'isDependencyMet', 'bunsenModel')
  /**
   * Whether or not component should render if it is a dependency
   * @param {Object} cellConfig - cell config
   * @param {Boolean} isDependencyMet - whether or not dependency is met
   * @param {Object} bunsenModel - model schema for the property this input refers to
   * @returns {Boolean} whether or not component should render if it is a dependency
   */
  shouldRender (cellConfig, isDependencyMet, bunsenModel) {
    const dependsOn = _.get(cellConfig, 'dependsOn')
    return (!dependsOn || isDependencyMet) && (bunsenModel !== undefined)
  },

  @readOnly
  @computed(
    'cellConfig', 'bunsenModel.{editable,enum,modelType,type}', 'readOnly', 'shouldRender',
    'renderers'
  )
  /**
   * Get name of component helper
   * @param {Object} cellConfig - cell config
   * @param {Boolean} editable - whether or not input should be editable (defined in model)
   * @param {Array<String>} enumList - list of possible values
   * @param {String} modelType - name of Ember Data model for lookup
   * @param {String} type - type of input to render
   * @param {Boolean} readOnly - whether or not input should be rendered as read only
   * @param {Boolean} shouldRender - whether or not input should render if it is a dependency
   * @param {Object} renderers - key value pairs mapping custom renderers to component helper names
   * @returns {String} name of component helper to use for input
   */
  inputName (cellConfig, editable, enumList, modelType, type, readOnly, shouldRender, renderers) {
    const renderer = _.get(cellConfig, 'renderer.name')

    if (renderer) {
      return this.getComponentName(renderer, renderers)
    }

    if (readOnly || editable === false) {
      return 'frost-bunsen-input-static'
    }

    if (enumList || modelType) {
      return 'frost-bunsen-input-select'
    }

    return this.getComponentName(type, renderers)
  },

  // == Functions ==============================================================

  /**
   * Get component name for a provided renderer name
   * @param {String} renderer - name of renderer
   * @param {Object} renderers - mapping of renderer names to component names
   * @returns {String} component name for renderer
   */
  getComponentName (renderer, renderers) {
    // If renderer is in renderers mapping use mapped name
    if (renderer in renderers) {
      return renderers[renderer]
    }

    if (validateRenderer(getOwner(this), renderer)) {
      return getRendererComponentName(renderer)
    }

    throw new Error(`"${renderer}" is not a registered component or in the renderers mapping`)
  }
})
