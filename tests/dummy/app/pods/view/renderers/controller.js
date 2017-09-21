import Ember from 'ember'
const {Controller, Logger, inject, run} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import rawFiles from 'ember-frost-demo-components/raw'
import PropTypeMixin, {PropTypes} from 'ember-prop-types'

import models from './models'
import plugins from './plugins'
import values from './values'
import views from './views'

const {keys} = Object

const rendererOptions = keys(models)
  .map((renderer) => {
    return {
      label: renderer,
      value: renderer
    }
  })

export default Controller.extend(PropTypeMixin, {
  store: inject.service('store'),
  queryParams: ['renderer'],
  renderer: rendererOptions[0].value,

  propTypes: {
    selectedTab: PropTypes.string
  },

  getDefaultProps () {
    return {
      selectedTab: 'doc'
    }
  },

  @readOnly
  @computed('renderer')
  plugins (renderer) {
    const plugin = plugins[renderer]
    if (plugin) {
      return plugin(this.get('store'))
    }
    return {}
  },

  @readOnly
  @computed('renderer')
  bunsenModel (renderer) {
    return models[renderer]
  },

  @readOnly
  @computed('renderer')
  bunsenView (renderer) {
    return views[renderer]
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

      case 'plugin':
        return this.get('pluginCode')

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

  @readOnly
  @computed('selectedTab')
  pluginClass (selectedTab) {
    return selectedTab === 'plugin' ? 'active' : ''
  },

  @readOnly
  @computed('renderer')
  documentation (renderer) {
    const key = `${renderer}.md`
    return rawFiles.view.renderers.documentation[key] || 'No content found'
  },

  @readOnly
  @computed('renderer')
  pluginCode (renderer) {
    const key = `${renderer}.js`
    return rawFiles.view.renderers.plugins[key] || ' No plugin found'
  },

  init () {
    this._super(...arguments)

    const renderer = this.get('renderer')

    this.setProperties({
      value: values[renderer],
      rendererOptions
    })
  },

  actions: {
    onFormValueChange (value) {
      run.next(() => {
        this.set('value', value)
      })
    },

    onFormValidation (result) {
      Logger.log(result)
    },

    onSelectedRendererChange (value) {
      this.setProperties({
        value: values[value],
        renderer: value
      })
    },

    selectTab (tab) {
      this.set('selectedTab', tab)
    }
  }
})
