import Ember from 'ember'
const {Controller, Logger} = Ember

const bunsenModel = {
  properties: {
    bar: {
      type: 'string'
    },
    foo: {
      type: 'string'
    }
  },
  type: 'object'
}

const bunsenValue = {
  foo: 'Baz'
}

const bunsenView = {
  cells: [
    {
      model: 'foo'
    },
    {
      model: 'bar'
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

    tabChange (alias) {
      Logger.info(`Tab selected with alias ${alias}`)
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
