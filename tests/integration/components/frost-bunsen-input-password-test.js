import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'

const cellConfig = {
  model: 'password',
  renderer: {
    name: 'password'
  }
}

const view = {
  containers: [
    {
      id: 'main',
      children: [
        [cellConfig]
      ]
    }
  ],
  cells: [{
    container: 'main',
    label: 'Main'
  }],
  type: 'form',
  version: '2.0'
}

describeComponent(...integrationTestContext('frost-bunsen-input-password'), function () {
  let rootNode

  beforeEach(function () {
    const props = {
      bunsenId: 'password',
      bunsenModel: {
        type: 'string'
      },
      bunsenStore: Ember.Object.create({
        view
      }),
      cellConfig: Ember.Object.create(cellConfig),
      onChange () {},
      state: Ember.Object.create({}),
      value: undefined // Must be present so we can set it via this.set('value', value)
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-password', props)
  })

  describe('when bunsenStore.disabled is true', function () {
    beforeEach(function () {
      this.set('bunsenStore.disabled', true)
    })

    it('disables input', function () {
      const $input = rootNode.find('.frost-text input')
      expect($input.is(':disabled')).to.be.true
    })
  })

  describe('when bunsenStore.disabled is false', function () {
    beforeEach(function () {
      this.set('bunsenStore.disabled', false)
    })

    it('disables input', function () {
      const $input = rootNode.find('.frost-text input')
      expect($input.is(':disabled')).to.be.false
    })
  })
})
