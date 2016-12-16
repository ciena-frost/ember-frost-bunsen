import Ember from 'ember'
const {Component} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {HookMixin} from 'ember-hook'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-section'

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32
}

export default Component.extend(HookMixin, PropTypeMixin, {
  // == Component Properties ===================================================

  classNameBindings: ['state.expanded:frost-bunsen-expanded:frost-bunsen-collapsed'],
  classNames: ['frost-bunsen-section'],
  layout,

  // == State Properties =======================================================

  propTypes: {
    clearable: PropTypes.bool,
    collapsible: PropTypes.bool,
    description: PropTypes.oneOfType([
      PropTypes.null,
      PropTypes.string
    ]),
    expanded: PropTypes.bool,
    expandedOnInitialRender: PropTypes.bool,
    formHook: PropTypes.string,
    onClear: PropTypes.func,
    onToggle: PropTypes.func,
    renderContentWhenCollapsed: PropTypes.bool,
    required: PropTypes.bool.isRequired,
    title: PropTypes.string
  },

  getDefaultProps () {
    return {
      clearable: false,
      expandedOnInitialRender: true,
      renderContentWhenCollapsed: false
    }
  },

  // == Computed Properties ====================================================

  @readOnly
  @computed('state.expanded', 'renderContentWhenCollapsed')
  /**
   * Whether or not to show section content
   * @param {Boolean} expanded - whether or not section is exapnded
   * @param {Boolean} renderContentWhenCollapsed - whether or not to render content when section is collapsed
   * @returns {Boolean} whether or not to show content
   */
  showContent (expanded, renderContentWhenCollapsed) {
    return expanded || renderContentWhenCollapsed
  },

  // == Functions ==============================================================

  /**
   * Initialize state
   */
  init () {
    this._super()
    let initialState
    if (this.get('expanded') === undefined) {
      initialState = {
        expanded: this.get('expandedOnInitialRender')
      }
    }
    this.set('state', Ember.Object.create(initialState))
  },

  /**
   * Handle updates to properties by consumer
   */
  didReceiveAttrs () {
    this._super(...arguments)
    const expanded = this.get('expanded')

    if (expanded !== undefined && this.get('state.expanded') !== expanded) {
      this.set('state.expanded', expanded)
    }
  },

  // == Actions ================================================================

  actions: {
    /**
     * Handle key press when focused on toggle icon
     * @param {KeyboardEvent} e - keyboard event
     */
    handleToggleKeyPress (e) {
      switch (e.keyCode) {
        case KEY_CODES.ENTER:
        case KEY_CODES.SPACE:
          this.send('toggle', e)
          break
      }
    },

    /**
     * Handle when user expands/collapses section
     * @param {Event} e - event
     */
    toggle (e) {
      e.stopPropagation()
      e.preventDefault()

      const expanded = !this.get('state.expanded')
      this.set('state.expanded', expanded)

      if (this.onToggle) {
        this.onToggle(expanded)
      }
    }
  }
})
