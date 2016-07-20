import {expect} from 'chai'
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {recursiveObjectCreate} from 'ember-frost-bunsen/utils'
import {builtInRenderers} from 'bunsen-core/validator'
import {setupComponentTest} from 'dummy/tests/helpers/template'

import model from '../../fixtures/valid-model'
import view from '../../fixtures/valid-view'

const renderers = Ember.assign({
  BooleanRender: 'boolean-renderer',
  NameRenderer: 'name-renderer'
}, builtInRenderers)

const props = {
  bunsenModel: model,
  bunsenStore: recursiveObjectCreate({
    renderers,
    value: {},
    view
  }),
  config: Ember.Object.create({}),
  errors: {},
  onChange () {},
  value: {}
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-cell')
  })

  describe('when sub-model is an object', function () {
    beforeEach(function () {
      const config = Ember.Object.create(view.cellDefinitions.main.children[1])
      this.set('config', config) // name model
    })

    // TODO: get test working
    // it('renders a frost-bunsen-model-container', function () {
    //   expect(ctx.rootNode.find('.frost-bunsen-model-container')).to.have.length(1)
    // })
  })

  describe('when sub-model is an array', function () {
    beforeEach(function () {
      const config = Ember.Object.create(view.cellDefinitions.main.children[1])
      this.set('config', config) // address
    })

    it('renders a frost-bunsen-array-container', function () {
      expect(ctx.rootNode.find('.frost-bunsen-array-container')).to.have.length(1)
    })
  })

  describe('when sub-model is an input', function () {
    beforeEach(function () {
      const config = Ember.Object.create(view.cellDefinitions.name.children[0])
      this.set('config', config) // name.first
    })

    it('renders a frost-bunsen-input-wrapper', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-wrapper')).to.have.length(1)
    })
  })

  describe('when config is a cell', function () {
    beforeEach(function () {
      const config = Ember.Object.create(view.cellDefinitions.main.children[0])
      this.set('config', config) // name
    })

    it('renders a frost-bunsen-container', function () {
      expect(ctx.rootNode.find('.frost-bunsen-container')).to.have.length(1)
    })
  })
}

setupComponentTest('frost-bunsen-cell', props, tests)
