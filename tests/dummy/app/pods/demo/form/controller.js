import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'

export default Ember.Controller.extend({
  inline: false,
  selectedModel: null,
  selectedView: null,

  renderers: {
    AddressRenderer: 'address-renderer',
    BooleanRenderer: 'boolean-renderer',
    NameRenderer: 'name-renderer'
  },

  viewSelectionDisabled: true,

  updateViews: function () {
    const params = {
      modelId: this.get('selectedModel.id')
    }

    this.set('viewSelectionDisabled', true)

    this.store.query('view', params)
      .then((views) => {
        this.set('model.views', views)
        this.set('viewSelectionDisabled', false)
      })
  },

  @readOnly
  @computed('selectedModel.model')
  modelCode: function (model) {
    return JSON.stringify(model, null, 2)
  },

  @readOnly
  @computed('model.models')
  modelOptions: function (models) {
    return models.map((model) => {
      return {
        label: model.get('label'),
        value: model.get('id')
      }
    })
  },

  @readOnly
  @computed('model.values')
  valueOptions: function (values) {
    return values.map((value) => {
      return {
        label: value.get('label'),
        value: value.get('id')
      }
    })
  },

  @readOnly
  @computed('selectedView.view')
  viewCode: function (view) {
    return JSON.stringify(view, null, 2)
  },

  @readOnly
  @computed('model.views')
  viewOptions: function (views) {
    return views.map((view) => {
      return {
        label: view.get('label'),
        value: view.get('id')
      }
    })
  },

  actions: {
    onChange (formValue) {
      formValue = JSON.stringify(formValue, null, 2)
      this.set('formValue', formValue)
      console.log(formValue)
    },

    onSelectModel: function (selected) {
      const selectedModel = this.get('model.models').findBy('id', selected[0])
      this.set('selectedModel', selectedModel)
      this.set('selectedView', null)
      this.updateViews()
    },

    onSelectView: function (selected) {
      const selectedView = this.get('model.views').findBy('id', selected[0])
      this.set('selectedView', selectedView)
    },

    onSelectValue: function (selected) {
      const selectedValue = this.get('model.values').findBy('id', selected[0])
      this.set('selectedValue', selectedValue)
    },

    toggleInline: function () {
      const isInline = this.get('inline')
      this.set('inline', !isInline)
    }
  }
})
