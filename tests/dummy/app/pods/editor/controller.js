import Ember from 'ember'
const {Controller, Logger, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

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
  modelErrored: false,
  viewErrored: false,
  valueErrored: false,

  @readOnly
  @computed('modelErrored')
  modelClass (errored) {
    const errorClass = errored ? 'error' : ''
    return `text-editor ${errorClass}`
  },

  @readOnly
  @computed('viewErrored')
  viewClass (errored) {
    const errorClass = errored ? 'error' : ''
    return `text-editor ${errorClass}`
  },

  @readOnly
  @computed('valueErrored')
  valueClass (errored) {
    const errorClass = errored ? 'error' : ''
    return `text-editor ${errorClass}`
  },

  actions: {
    formChange (bunsenValue) {
      run.next(() => {
        this.setProperties({
          bunsenValue,
          bunsenValueString: JSON.stringify(bunsenValue, null, 2)
        })
      })
    },

    modelUpdated (newValue) {
      try {
        const model = JSON.parse(newValue)
        this.setProperties({
          bunsenModel: model,
          bunsenModelString: newValue,
          modelErrored: false
        })
      } catch (err) {
        this.set('bunsenModelString', newValue)
        this.setProperties({
          bunsenModelString: newValue,
          modelErrored: true
        })
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
          bunsenValueString: newValue,
          valueErrored: false
        })
      } catch (err) {
        this.setProperties({
          bunsenValueString: newValue,
          valueErrored: true
        })
      }
    },

    viewUpdated (newValue) {
      try {
        const view = JSON.parse(newValue)
        this.setProperties({
          bunsenView: view,
          bunsenViewString: newValue,
          viewErrored: false
        })
      } catch (err) {
        this.setProperties({
          bunsenViewString: newValue,
          viewErrored: true
        })
      }
    }
  }
})
