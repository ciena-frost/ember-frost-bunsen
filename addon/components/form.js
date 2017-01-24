import {actions} from 'bunsen-core'
const {validate} = actions
import Ember from 'ember'
const {$, RSVP, VERSION} = Ember
import {PropTypes} from 'ember-prop-types'

import DetailComponent from './detail'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-form'

const [major, minor] = VERSION.split('.')
const isGlimmer1 = major < 2 || (major === 2 && minor < 10)

export default DetailComponent.extend({
  // == Component Properties ===================================================

  layout,

  // == State Properties =======================================================

  propTypes: {
    autofocus: PropTypes.bool,
    bunsenModel: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]).isRequired,
    bunsenView: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    disabled: PropTypes.bool,
    hook: PropTypes.string,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    onTabChange: PropTypes.func,
    onValidation: PropTypes.func,
    registeredComponents: PropTypes.array,
    renderers: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    showAllErrors: PropTypes.bool,
    validators: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.null,
      PropTypes.object
    ])
  },

  getDefaultProps () {
    return {
      autofocus: true,
      classNames: ['frost-bunsen-form'],
      disabled: false,
      hook: 'bunsenForm',
      inputValidators: [],
      renderers: {},
      registeredComponents: [],
      showAllErrors: false,
      validators: [],
      value: null
    }
  },

  // == Functions ==============================================================

  triggerValidation () {
    const model = this.get('renderModel')
    const reduxStore = this.get('reduxStore')
    const validators = this.getAllValidators()
    const value = this.get('renderValue')

    reduxStore.dispatch(
      validate(null, value, model, validators, RSVP.all, true)
    )
  },

  _onVisiblityChange (e) {
    // Nothing to do when page/tab loses visiblity
    if (e.target.hidden) {
      return
    }

    this.triggerValidation()
  },

  // == Events =================================================================

  didInsertElement () {
    this._visibilityChangeHandler = this._onVisiblityChange.bind(this)
    document.addEventListener('visibilitychange', this._visibilityChangeHandler, false)
  },

  /**
   * After render select first input unless something else already has focus on page
   */
  didRender () {
    if (
      !isGlimmer1 || // autofocus won't let you leave focus from form in Glimmer 2
      !this.get('autofocus') || // autofucs feature is disabled
      $(':focus').length !== 0 // there is an element already in focus
    ) {
      return
    }

    // Focus on first input in busen form
    this.$(':input:enabled:visible:first').focus()
  },

  willDestroyElement () {
    document.removeEventListener('visibilitychange', this._visibilityChangeHandler)
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle when user updates form value
     * @param {String} bunsenId - ID of input that changed
     * @param {Object} inputValue - new value for input that changed
     */
    handleChange (bunsenId, inputValue) {
      const reduxStore = this.get('reduxStore')
      reduxStore.dispatch(
        validate(bunsenId, inputValue, this.get('renderModel'), this.getAllValidators(), RSVP.all)
      )
    }
  }
})
