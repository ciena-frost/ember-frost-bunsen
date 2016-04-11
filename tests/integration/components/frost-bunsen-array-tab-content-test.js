const expect = chai.expect
import {it} from 'ember-mocha'
import {setupComponentTest} from '../../utils/template'

const props = {
  bunsenId: 'addresses',
  cellConfig: Ember.Object.create({
    item: Ember.Object.create({})
  }),
  errors: null,
  index: 0,
  model: {
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
  onChange () {},
  store: Ember.Object.create({}),
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

setupComponentTest('frost-bunsen-array-tab-content', props, tests)
