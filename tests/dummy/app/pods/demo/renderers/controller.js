import Ember from 'ember'
const {Controller} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

import rawFiles from 'ember-frost-demo-components/raw'
import models from './models'
import views from './views'

const rendererOptions = Object.keys(models)
  .map((renderer) => {
    return {
      label: renderer,
      value: renderer
    }
  })

export default Controller.extend(PropTypeMixin, {
  propTypes: {
    selectedTab: PropTypes.string
  },

  getDefaultProps () {
    return {
      selectedTab: 'doc'
    }
  },

  @readOnly
  @computed('selectedRendererValue')
  bunsenModel (selectedRendererValue) {
    return models[selectedRendererValue]
  },

  @readOnly
  @computed('selectedRendererValue')
  bunsenView (selectedRendererValue) {
    return views[selectedRendererValue]
  },

  @readOnly
  @computed('selectedTab')
  code (selectedTab) {
    switch (selectedTab) {
      case 'model':
        return JSON.stringify(this.get('bunsenModel'), null, 2)

      case 'value':
        return JSON.stringify(this.get('value'), null, 2)

      case 'view':
        return JSON.stringify(this.get('bunsenView'), null, 2)

      default:
        return ''
    }
  },

  @readOnly
  @computed('selectedTab')
  docClass (selectedTab) {
    return selectedTab === 'doc' ? 'active' : ''
  },

  @readOnly
  @computed('selectedTab')
  modelClass (selectedTab) {
    return selectedTab === 'model' ? 'active' : ''
  },

  @readOnly
  @computed('selectedTab')
  viewClass (selectedTab) {
    return selectedTab === 'view' ? 'active' : ''
  },

  @readOnly
  @computed('selectedTab')
  valueClass (selectedTab) {
    return selectedTab === 'value' ? 'active' : ''
  },

  getDocumentation (rendererName) {
    const key = `${rendererName}.md`
    return rawFiles.demo.renderers.documentation[key] || 'No content found'
  },

  init () {
    this._super(...arguments)

    const selectedRendererValue = rendererOptions[0].value
    const documentation = this.getDocumentation(selectedRendererValue)

    this.setProperties({
      value: {},
      documentation,
      rendererOptions,
      selectedRendererValue
    })
  },

  actions: {
    onFormValueChange (value) {
      this.set('value', value)
    },

    onSelectedRendererChange (value) {
      this.setProperties({
        documentation: this.getDocumentation(value),
        value: {},
        selectedRendererValue: value
      })
    },

    selectTab (tab) {
      this.set('selectedTab', tab)
    }
  }
})
