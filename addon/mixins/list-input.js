// import _ from 'lodash'
import Ember from 'ember'
// import computed, {readOnly} from 'ember-computed-decorators'

import * as utils from '../components/utils'

export default Ember.Mixin.create({
  init () {
    this._super(...arguments)
    this.set('options', [])
  },

  didReceiveAttrs () {
    this._super(...arguments)
    this.setOptions()
  },

  /**
  * Setup options for drop-down
  */
  setOptions () {
    const modelDef = this.get('model')
    const enumDef = modelDef.get('enum')
    const queryDef = modelDef.get('query')
    if (enumDef) {
      this.setEnumValues(enumDef)
    } else if (queryDef) {
      this.setAsyncDataValues(modelDef, queryDef)
    }
  },

  /**
   * getEnumValues - take enum values and make into a collection
   * @param  {String[]} values the values to make into a collection
   */
  setEnumValues (values) {
    const items = values.map((value) => {
      const label = Ember.String.capitalize(
        value.split('-').join(' ').toLowerCase()
      )
      return {label, value}
    })
    this.set('options', items)
  },

  /**
   * setAsyncDataValues - Fetch the list of network functions from the backend and set them
   * @param  {Object} modelDef the full bunsen model def for this property
   * @param  {Object} queryDef the query obj from the model def
   */
  setAsyncDataValues (modelDef, queryDef) {
    const dbStore = this.get('dbStore')
    const query = utils.createQuery(queryDef)
    const modelType = modelDef.get('modelType') || 'resources'
    dbStore.query(modelType, query).then((resp) => {
      const items = resp.map((resource) => {
        const labelAttr = modelDef.get('labelAttribute') || 'label'
        const valueAttr = modelDef.get('valueAttribute') || 'id'
        const label = resource.get(labelAttr) || resource.get('title')
        const value = resource.get(valueAttr)
        return {
          label,
          value
        }
      })
      this.set('options', items)
    }).catch((err) => { // eslint-disable-line handle-callback-err
      Ember.Logger.log(`Error fetching ${modelType}`, err)
    })
  }
})
