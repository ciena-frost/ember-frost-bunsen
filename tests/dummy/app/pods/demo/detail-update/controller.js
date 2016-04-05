import Ember from 'ember'
const {Controller} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import _ from 'lodash'

export default Controller.extend({
  selectedModel: null,
  selectedValue: null,
  selectedView: null,

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
  @computed('selectedModel.model')
  modelCode (model) {
    return JSON.stringify(model, null, 2)
  },

  @readOnly
  @computed('model.models')
  modelOptions (models) {
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
    return views.map((view) => {
      return {
        label: view.get('label'),
        value: view.get('id')
      }
    })
  },

  @readOnly
  @computed('formValue')
  renderValue (formValue) {
    return JSON.stringify(formValue, null, 2)
  },

  actions: {
    onSelectModel (selected) {
      const selectedModel = this.get('model.models').findBy('id', selected[0])

      this.setProperties({
        formValue: null,
        selectedModel: selectedModel,
        selectedValue: null,
        selectedView: null,
        value: null
      })

      this.updateViews()
      this.updateValues()
    },

    onSelectValue (selected) {
      const selectedValue = this.get('model.values').findBy('id', selected[0])
      this.set('selectedValue', selectedValue)
    },

    onSelectView (selected) {
      const selectedView = this.get('model.views').findBy('id', selected[0])
      this.set('selectedView', selectedView)
    },
    onValueChange (value) {
      this.set('formValue', value)
    },
    updateValue () {
      this.set('value', _.clone(this.get('formValue')))
    }
  }
})
