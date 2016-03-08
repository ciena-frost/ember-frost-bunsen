const expect = chai.expect
import {it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {recursiveObjectCreate} from 'ember-frost-bunsen/components/utils'
import {setupComponentTest} from '../../../utils/template'

import model from '../../../fixtures/valid-model'
import view from '../../../fixtures/valid-view'

const props = {
  config: Ember.Object.create({}),
  model,
  'on-change': () => {},
  store: recursiveObjectCreate({
    formValue: {},
    renderers: {
      BooleanRender: 'boolean-renderer',
      NameRenderer: 'name-renderer'
    },
    view
  })
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-cell')
  })

  describe('when sub-model is an object', function () {
    beforeEach(function () {
      Ember.run(() => {
        this.set('config', view.containers[0].rows[1][0]) // name model
      })
    })

    // TODO: get test working
    // it('renders a frost-bunsen-container-model', function () {
    //   expect(ctx.rootNode.find('.frost-bunsen-container-model')).to.have.length(1)
    // })
  })

  describe('when sub-model is an array', function () {
    beforeEach(function () {
      Ember.run(() => {
        this.set('config', view.containers[0].rows[1][0]) // address
      })
    })

    it('renders a frost-bunsen-container-array', function () {
      expect(ctx.rootNode.find('.frost-bunsen-container-array')).to.have.length(1)
    })
  })

  describe('when sub-model is an input', function () {
    beforeEach(function () {
      Ember.run(() => {
        this.set('config', view.containers[1].rows[0][0]) // name.first
      })
    })

    it('renders a frost-bunsen-input', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input')).to.have.length(1)
    })
  })

  describe('when config is a container', function () {
    beforeEach(function () {
      Ember.run(() => {
        this.set('config', view.containers[0].rows[0][0]) // name
      })
    })

    it('renders a frost-bunsen-container', function () {
      expect(ctx.rootNode.find('.frost-bunsen-container')).to.have.length(1)
    })
  })
}

setupComponentTest('frost-bunsen-cell', props, tests)
