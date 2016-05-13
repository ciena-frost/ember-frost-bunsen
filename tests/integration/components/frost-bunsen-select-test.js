import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe, mocha} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'

mocha.setup({
  timeout: 10000
})

const cellConfig = {
  model: 'name',
  renderer: 'select',
  writeTransforms: [
    {
      object: {
        id: '${id}',
        index: '${index}',
        label: '${label}',
        literal: 'foo',
        value: '${value}'
      }
    }
  ]
}

const view = {
  containers: [
    {
      id: 'main',
      rows: [
        [cellConfig]
      ]
    }
  ],
  rootContainers: [{
    container: 'main',
    label: 'Main'
  }],
  type: 'form',
  version: '1.0'
}

describeComponent(...integrationTestContext('frost-bunsen-input-select'), function () {
  let rootNode

  beforeEach(function () {
    const props = {
      bunsenId: 'name',
      cellConfig: Ember.Object.create(cellConfig),
      model: {
        enum: ['Adam', 'Chris', 'Matt', 'Niko', 'Sophy'],
        type: 'string'
      },
      onChange () {},
      store: Ember.Object.create({
        view
      }),
      state: Ember.Object.create({}),
      value: undefined // Must be present so we can set it via this.set('value', value)
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-select', props)
  })

  describe('applies write transforms to changes', function () {
    it('applies object transform', function (done) {
      this.set('onChange', (id, value) => {
        expect(id).to.equal('name')
        expect(value).to.eql({
          id: 'name',
          index: '1',
          label: 'Chris',
          literal: 'foo',
          value: 'Chris'
        })
        done()
      })

      rootNode.find('.down-arrow').click()
      rootNode.find('li[data-value="Chris"]').click()
    })
  })
})
