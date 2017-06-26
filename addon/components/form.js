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

  classNames: ['frost-bunsen-form'],
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
    validateOnVisibilityChange: PropTypes.bool,
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
      disabled: false,
      hook: 'bunsenForm',
      inputValidators: [],
      renderers: {},
      registeredComponents: [],
      showAllErrors: false,
      validateOnVisibilityChange: true,
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
    // or skip if disabled
    if (e.target.hidden || !this.get('validateOnVisibilityChange')) {
      return
    }

    this.triggerValidation()
  },

  // == Events =================================================================

  init () {
    this._super(...arguments)
    const classNames = this.get('classNames').filter((className) => className !== 'frost-bunsen-detail')
    // prevent frost-bunsen-detail from being applied through inheritance but allow overrides on the template
    this.set('classNames', classNames)
  },

  didInsertElement () {
    this._visibilityChangeHandler = this._onVisiblityChange.bind(this)
    document.addEventListener('visibilitychange', this._visibilityChangeHandler, false)
  },

  /**
   * After render select first input unless something else already has focus on page
   */
  didRender () {
    const focusedElement = this.get('focusedElement')
    if (this.get('rerendering') && focusedElement) {
      this.$(`[data-bunsenid='${focusedElement.bunsenId}'] ${focusedElement.selector}`).focus()
      this.set('rerendering', false)
    }

    if (
      !isGlimmer1 || // autofocus won't let you leave focus from form in Glimmer 2
      !this.get('autofocus') || // autofocus feature is disabled
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

  focusOut () {
    if (this.isDestroyed || this.isDestroying) return
    if (!this.get('rerendering')) {
      this.set('focusedElement', null)
    }
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
      if (this.isDestroyed || this.isDestroying) return
      this.set('rerendering', true)
    },
    onFocus (bunsenId, selector) {
      if (this.isDestroyed || this.isDestroying) return
      this.set('focusedElement', {
        bunsenId,
        selector
      })
    }
  }
})
