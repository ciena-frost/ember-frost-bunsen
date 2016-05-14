import Ember from 'ember'
const {Controller, Logger} = Ember
import computed, {readOnly} from 'ember-computed-decorators'

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

export default Controller.extend({
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

  getDocumentation (rendererName) {
    const key = `${rendererName}.md`
    return rawFiles.demo.renderers.documentation[key] || 'No content found'
  },

  init () {
    this._super(...arguments)

    const selectedRendererValue = rendererOptions[0].value
    const documentation = this.getDocumentation(selectedRendererValue)

    this.setProperties({
      bunsenValue: {},
      documentation,
      rendererOptions,
      selectedRendererValue
    })
  },

  actions: {
    onFormValueChange (value) {
      Logger.info(value)
    },

    onSelectedRendererChange (value) {
      this.setProperties({
        documentation: this.getDocumentation(value),
        bunsenValue: {},
        selectedRendererValue: value
      })
    }
  }
})
