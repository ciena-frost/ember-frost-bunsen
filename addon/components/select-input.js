import Input from './abstract-input'
import * as listUtils from '../list-utils'
import Ember from 'ember'

export default Input.extend({
  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  getDefaultProps () {
    return {
      options: Ember.A([])
    }
  },

  dbStore: Ember.inject.service('store'),

  selectedOptions: [],

  didReceiveAttrs () {
    this._super(...arguments)
    const modelDef = this.get('model')
    if (!modelDef) {
      return
    }
    const dbStore = this.get('dbStore')
    const value = this.get('store.formValue')
    const bunsenId = this.get('bunsenId')
    listUtils.getOptions(value, modelDef, bunsenId, dbStore).then((opts) => {
      this.set('options', opts)
    })
  },

  /**
   * This should be overriden by inherited inputs to convert the value to the appropriate format
   * @param {Boolean|String} data - value to parse
   * @returns {any} parsed value
   */
  parseValue (data) {
    return data[0]
  },

  actions: {
    /**
     * perform a filter on the widget
     * @param  {String} filter the filter text
     */
    onInput (filter) {
      const modelDef = this.get('model')
      const bunsenId = this.get('bunsenId')
      const dbStore = this.get('dbStore')
      const value = this.get('store.formValue')
      listUtils.getOptions(value, modelDef, bunsenId, dbStore, filter).then((opts) => {
        this.set('options', opts)
      })
    }
  }
})
