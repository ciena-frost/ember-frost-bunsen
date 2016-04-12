import Input from './abstract-input'
import * as listUtils from '../list-utils'
import Ember from 'ember'
import _ from 'lodash'

export default Input.extend({
  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  init () {
    this._super(...arguments)
    this.set('options', Ember.A([]))
  },

  didReceiveAttrs () {
    this._super(...arguments)
    const modelDef = this.get('model')
    if (modelDef) {
      const dbStore = this.get('model.dbStore')
      const promise = listUtils.getOptions(modelDef, dbStore)
      promise.then((opts) => {
        this.set('options', opts)
      })
    }
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
        onChange(
          this.get('bunsenId'),
          newValue
        )
      }
      this.set('state.value', newValue)
    }
  }
})
