import {expect} from 'chai'
import {beforeEach, describe, it} from 'mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

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
    item: Ember.Object.create({})
  }),
  errors: {},
  index: 0,
  onChange () {},
  onRemove () {},
  sortable: false,
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
    expect(ctx.rootNode).to.have.class('item-wrapper')
  })

  describe('when sortable is false', function () {
    beforeEach(function () {
      this.set('sortable', false)
    })

    it('does not render sort handle', function () {
      expect(ctx.rootNode.find('.handle').length).to.eql(0)
    })
  })

  describe('when sortable is true', function () {
    beforeEach(function () {
      this.set('sortable', true)
    })

    it('renders sort handle', function () {
      expect(ctx.rootNode.find('.handle').length).to.eql(1)
    })
  })
}

setupComponentTest('frost-bunsen-array-inline-item', props, tests)
