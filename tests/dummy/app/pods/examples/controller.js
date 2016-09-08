import Ember from 'ember'
const {Controller, Logger} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

export default Controller.extend({
  detail: false,
  disabled: false,
  showAllErrors: false,

  queryParams: [
    {selectedModelId: 'model'},
    {selectedValueId: 'value'},
    {selectedViewId: 'view'}
  ],

  selectedViewId: null,
  selectedModelId: null,
  selectedValueId: null,

  renderers: {
    AddressRenderer: 'address-renderer',
    BooleanRenderer: 'boolean-renderer',
    NameRenderer: 'name-renderer'
  },

  valueSelectionDisabled: true,
  viewSelectionDisabled: true,

  updateValues () {
    const params = {
      modelId: this.get('selectedModel.id')
    }

    this.set('valueSelectionDisabled', true)

    this.store.query('value', params)
      .then((values) => {
        this.set('model.values', values)
        this.set('valueSelectionDisabled', false)
      })
  },

  updateViews () {
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
  @computed('model.models', 'selectedModelId')
  selectedModel (models, id) {
    if (!models) {
      return null
    }
    return models.findBy('id', id)
  },

  @readOnly
  @computed('model.views', 'selectedViewId')
  selectedView (views, id) {
    if (!views) {
      return null
    }
    return views.findBy('id', id)
  },

  @readOnly
  @computed('model.values', 'selectedValueId')
  selectedValue (values, id) {
    if (!values) {
      return null
    }
    return values.findBy('id', id)
  },

  @readOnly
  @computed('selectedModel.model')
  modelCode (model) {
    return JSON.stringify(model, null, 2)
  },

  @readOnly
  @computed('model.models')
  modelOptions (models) {
    if (!models) {
      return null
    }

    return models.map((model) => {
      return {
        label: model.get('label'),
        value: model.get('id')
      }
    })
  },

  @readOnly
  @computed('model.values')
  valueOptions (values) {
    if (!values) {
      return null
    }

    return values.map((value) => {
      return {
        label: value.get('label'),
        value: value.get('id')
      }
    })
  },

  @readOnly
  @computed('selectedView.view')
  viewCode (view) {
    return JSON.stringify(view, null, 2)
  },

  @readOnly
  @computed('model.views')
  viewOptions (views) {
    if (!views) {
      return null
    }

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
    },

    onSelectModel (selected) {
      const selectedModelId = selected[0]

      this.setProperties({
        selectedModelId,
        selectedValueId: null,
        selectedViewId: null
      })

      this.updateViews()
      this.updateValues()
    },

    onSelectView (selected) {
      this.set('selectedViewId', selected[0])
    },

    onSelectValue (selected) {
      this.set('selectedValueId', selected[0])
    },

    onValidation (errors) {
      Logger.log(errors)
    },

    toggleDetail () {
      const isDetail = this.get('detail')
      this.set('detail', !isDetail)
    },

    toggleDisabled () {
      const isDisabled = this.get('disabled')
      this.set('disabled', !isDisabled)
    },

    toggleShowAllErrors () {
      const showAllErrors = this.get('showAllErrors')
      this.set('showAllErrors', !showAllErrors)
    }
  }
})
