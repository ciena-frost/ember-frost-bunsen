import Ember from 'ember'
const {Controller} = Ember

const bunsenModel = {
  properties: {
    foo: {
      type: 'string'
    }
  },
  type: 'object'
}

const bunsenValue = {
  foo: 'Bar'
}

const bunsenView = {
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
}

export default Controller.extend({
  bunsenModel,
  bunsenModelString: JSON.stringify(bunsenModel, null, 2),
  bunsenValue,
  bunsenValueString: JSON.stringify(bunsenValue, null, 2),
  bunsenView,
  bunsenViewString: JSON.stringify(bunsenView, null, 2),

  actions: {
    formChange (bunsenValue) {
      this.setProperties({
        bunsenValue,
        bunsenValueString: JSON.stringify(bunsenValue, null, 2)
      })
    },

    modelUpdated (newValue) {
      try {
        const model = JSON.parse(newValue)
        this.setProperties({
          bunsenModel: model,
          bunsenModelString: newValue
        })
      } catch (err) {
        this.set('bunsenModelString', newValue)
      }
    },

    valueUpdated (newValue) {
      try {
        const value = JSON.parse(newValue)
        this.setProperties({
          bunsenValue: value,
          bunsenValueString: newValue
        })
      } catch (err) {
        this.set('bunsenValueString', newValue)
      }
    },

    viewUpdated (newValue) {
      try {
        const view = JSON.parse(newValue)
        this.setProperties({
          bunsenView: view,
          bunsenViewString: newValue
        })
      } catch (err) {
        this.set('bunsenViewString', newValue)
      }
    }
  }
})
