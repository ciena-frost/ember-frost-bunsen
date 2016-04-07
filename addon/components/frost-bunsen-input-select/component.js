import _ from 'lodash'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

import InputMixin from 'ember-frost-bunsen/mixins/input'
import layout from './template'

import * as utils from '../utils'

export default Ember.Component.extend(InputMixin, {
  classNames: [
    'frost-bunsen-input-text',
    'frost-field'
  ],
  layout,

  @readOnly
  @computed('cellConfig.properties.type')
  inputType (type) {
    return type || 'text'
  },

  // ==========================================================================
  // Computed Properties
  // ==========================================================================

  @readOnly
  @computed('model.enum')
  /**
  * Get options for drop-down
  * @param {String[]} values - drop-down values
  * @returns {DropDownOption[]} drop-down options
  */
  options (values) {
    return values.map((value) => {
      const label = Ember.String.capitalize(
        value.split('-').join(' ').toLowerCase()
      )
      return {label, value}
    })
  },

  // TODO: figure out why we can't use @readOnly (frost-text updating value property internally?)
  @computed('cellConfig.placeholder', 'state.value')
  /**
   * Text to render for value
   * @param {String} placeholder - placeholder text
   * @param {String|Boolean} value - value
   * @returns {String} text to render
   */
  renderValue: function (placeholder, value) {
    if (_.isBoolean(value)) {
      value = (value) ? 'true' : 'false'
    }
    if (value === '') {
      value = placeholder
    }
    return value
  },

  /**
   * Fetch the list of network functions from the backend and set them
   */
  getAsyncData () {
    const dbStore = this.get('dbStore')
    const query = utils.createQuery(this.get('model.query'))
    dbStore.query(this.get('model.modelType'), query).then((resp) => {
      const items = resp.map((resource) => {
        const label = resource.get('label')
        // const type = resource.get('properties.type') || 'Unknown Type'
        const hostname = resource.get('properties.connection.hostname') || 'Unknown Hostname'
        return {
          label: `${label} - ${hostname}`,
          value: resource.get('id')
        }
      })
      this.set('networkFunctions', items)
    }).catch((err) => { // eslint-disable-line handle-callback-err
      Ember.Logger.log('Error fetching NetworkFunctions', err)
    })
  },

  actions: {
    /**
     * Handle user updating value
     * @param {Event} e - event
     */
    onChange (e) {
      if (!this.get('state.hasUserInteracted')) {
        this.set('state.hasUserInteracted', true)
      }
      const newValue = e.value
      const oldValue = this.get('state.value')
      const onChange = this.get('onChange')
      // If value has not change then there is nothing to do
      if (newValue === oldValue) {
        return
      }
      if (onChange && _.isFunction(onChange)) {
        onChange({
          id: this.get('bunsenId'),
          value: newValue
        })
      }
      this.set('state.value', newValue)
    }
  }
})
