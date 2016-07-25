import Ember from 'ember'
const {Controller} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

export default Controller.extend({
  bunsenModel: {
    properties: {
      foo: {
        type: 'string'
      }
    },
    type: 'object'
  },
  bunsenValue: {
    foo: 'Bar'
  },
  bunsenView: {
    cellDefinitions: {
      main: {
        children: [
          {
            model: 'foo'
          }
        ]
      }
    },
    cells: [
      {
        extends: 'main',
        label: 'Main'
      }
    ],
    type: 'form',
    version: '2.0'
  },

  @readOnly
  @computed('bunsenModel')
  computedBunsenModel (bunsenModel) {
    return JSON.stringify(bunsenModel, null, 2)
  },

  @readOnly
  @computed('bunsenValue')
  computedBunsenValue (bunsenValue) {
    return JSON.stringify(bunsenValue, null, 2)
  },

  @readOnly
  @computed('bunsenView')
  computedBunsenView (bunsenView) {
    return JSON.stringify(bunsenView, null, 2)
  },

  actions: {
    formChange (bunsenValue) {
      this.set('bunsenValue', bunsenValue)
    },

    modelUpdated (newValue) {
      try {
        const bunsenModel = JSON.parse(newValue)
        this.set('bunsenModel', bunsenModel)
      } catch (err) {
        //
      }
    },

    valueUpdated (newValue) {
      try {
        const bunsenValue = JSON.parse(newValue)
        this.set('bunsenValue', bunsenValue)
      } catch (err) {
        //
      }
    },

    viewUpdated (newValue) {
      try {
        const bunsenView = JSON.parse(newValue)
        this.set('bunsenView', bunsenView)
      } catch (err) {
        //
      }
    }
  }
})
