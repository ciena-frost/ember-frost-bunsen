import Input from './abstract-input'
import * as listUtils from '../list-utils'
import Ember from 'ember'

export default Input.extend({
  classNames: [
    'frost-bunsen-input-select',
    'frost-field'
  ],

  init () {
    this._super(...arguments)
    this.set('options', Ember.A([]))
  },

  dbStore: Ember.inject.service('store'),

  selectedOptions: [],

  didReceiveAttrs () {
    this._super(...arguments)
    const modelDef = this.get('model')
    if (modelDef) {
      const dbStore = this.get('dbStore')
      const promise = listUtils.getOptions(modelDef, dbStore)
      promise.then((opts) => {
        this.set('options', opts)
      })
    }
  }
})
