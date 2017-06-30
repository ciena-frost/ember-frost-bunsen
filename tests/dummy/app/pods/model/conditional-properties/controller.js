import Ember from 'ember'
const {Controller, Logger} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import rawFiles from 'ember-frost-demo-components/raw'

import examples from './examples'

const {keys} = Object

const rendererOptions = keys(examples)
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
    return examples[selectedRendererValue]
  },

  getDocumentation (rendererName) {
    const key = `${rendererName}.md`
    return rawFiles.model['conditional-properties'].documentation[key] || 'No content found'
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
      Logger.info(value)
    },

    onExampleChange (value) {
      this.setProperties({
        documentation: this.getDocumentation(value),
        value: {},
        selectedRendererValue: value
      })
    }
  }
})
