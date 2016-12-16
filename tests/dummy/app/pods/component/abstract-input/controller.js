import Ember from 'ember'
const {Controller, getOwner} = Ember
import customRenderer from './custom-renderer'
import files from 'ember-frost-demo-components/raw'

export default Controller.extend({
  init () {
    // only necessary because this demo limits sources to this pod
    // but you would otherwise have this component under "pods/components"
    getOwner(this).register('component:custom-renderer', customRenderer)
    getOwner(this).register('template:components/custom-renderer',
      Ember.HTMLBars.compile(files.component['abstract-input']['layout.hbs']))
  },
  bunsenModel: {
    type: 'object',
    properties: {
      name: {
        type: 'object',
        properties: {
          first: {type: 'string'},
          last: {type: 'string'}
        }
      }
    }
  },
  bunsenValue: {},
  bunsenView: {
    version: '2.0',
    type: 'form',
    cells: [{
      model: 'name',
      renderer: {
        name: 'name'
      }
    }]
  },
  renderers: {
    'name': 'custom-renderer'
  },
  actions: {
    onFormChange () {
    },
    onValidation () {
    }
  }
})
