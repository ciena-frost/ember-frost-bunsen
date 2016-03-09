import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import PropTypeMixin, {PropTypes} from 'ember-prop-types'
import layout from './template'

export default Ember.Component.extend(PropTypeMixin, {
  classNameBindings: ['state.expanded:expanded:collapsed'],
  classNames: ['frost-bunsen-section'],

  layout,

  propTypes: {
    collapsible: PropTypes.bool,
    expanded: PropTypes.bool,
    expandedOnInitialRender: PropTypes.bool,
    instructions: PropTypes.string,
    onToggle: PropTypes.func,
    renderContentWhenCollapsed: PropTypes.bool,
    required: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
  },

  // Defaults
  expandedOnInitialRender: true,
  renderContentWhenCollapsed: false,

  /**
   * Initialize state
   */
  init: function () {
    this._super()
    this.set('state', Ember.Object.create({
      expanded: this.get('expanded') || this.get('expandedOnInitialRender')
    }))
  },

  /**
   * Handle updates to properties by consumer
   */
  didUpdateAttrs: function () {
    const expanded = this.get('expanded')

    if (expanded !== undefined && this.get('state.expanded') !== expanded) {
      this.set('state.expanded', expanded)
    }
  },

  @readOnly
  @computed('state.expanded', 'renderContentWhenCollapsed')
  /**
   * Whether or not to show section content
   * @param {Boolean} expanded - whether or not section is exapnded
   * @param {Boolean} renderContentWhenCollapsed - whether or not to render content when section is collapsed
   * @returns {Boolean} whether or not to show content
   */
  showContent: function (expanded, renderContentWhenCollapsed) {
    return expanded || renderContentWhenCollapsed
  },

  actions: {
    /**
     * Handle when user expands/collapses section
     * @param {Event} e - event
     */
    onToggle: function (e) {
      e.stopPropagation()
      e.preventDefault()

      const expanded = !this.get('state.expanded')
      const parentOnToggle = this.get('onToggle')

      this.set('state.expanded', expanded)

      if (parentOnToggle) {
        parentOnToggle(expanded)
      }
    }
  }
})
