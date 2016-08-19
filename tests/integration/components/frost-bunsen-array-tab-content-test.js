import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach} from 'mocha'
import {integrationTestContext} from 'dummy/tests/helpers/template'

const props = {
  bunsenId: 'addresses',
  bunsenModel: {
    items: {
      properties: {
        city: {type: 'string'},
        street: {type: 'string'},
        state: {type: 'string'},
        zip: {type: 'string'}
      },
      required: ['street', 'city', 'state', 'zip'],
      type: 'object'
    },
    minItems: 1
  },
  bunsenStore: Ember.Object.create({}),
  cellConfig: Ember.Object.create({
    arrayOptions: {
      itemCell: Ember.Object.create({})
    }
  }),
  errors: {},
  index: 0,
  onChange () {},
  value: {
    addresses: [
      {
        city: 'Petaluma',
        state: 'CA',
        street: '1383 N McDowell Blvd',
        zip: '94954'
      }
    ]
  }
}

function tests (ctx) {
  it('has correct classes', function () {
    expect(ctx.rootNode).to.have.class('frost-bunsen-array-tab-content')
  })
}

describeComponent(...integrationTestContext('frost-bunsen-array-tab-content'),
  function () {
    let ctx = {}

    beforeEach(function () {
      this.setProperties(props)
      this.render(hbs`{{frost-bunsen-array-tab-content
        bunsenId=bunsenId
        bunsenModel=bunsenModel
        bunsenStore=bunsenStore
        cellConfig=cellConfig
        errors=errors
        index=index
        onChange=onChange
        value=value
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
