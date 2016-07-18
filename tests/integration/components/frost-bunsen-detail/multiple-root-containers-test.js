import {expect} from 'chai'
import {it} from 'ember-mocha'
import {describe} from 'mocha'
import {setupComponentTest} from 'dummy/tests/helpers/template'

const props = {
  bunsenModel: {
    properties: {
      bar: {type: 'number'},
      baz: {type: 'boolean'},
      foo: {type: 'string'}
    },
    type: 'object'
  },
  bunsenView: {
    containers: [
      {
        id: 'one',
        rows: [
          [{model: 'foo'}],
          [{model: 'bar'}]
        ]
      },
      {
        id: 'two',
        rows: [
          [{model: 'baz'}]
        ]
      }
    ],
    cells: [
      {label: 'One', container: 'one'},
      {label: 'Two', container: 'two'}
    ],
    type: 'form',
    version: '2.0'
  }
}

function tests (ctx) {
  describe('multiple root containers', function () {
    it('renders frost-tabs', function () {
      expect(ctx.rootNode.find('.frost-tabs').length).to.equal(1)
    })

    it('renders tab for each root container', function () {
      expect(ctx.rootNode.find('.frost-tabs .frost-button').length).to.equal(2)
    })
  })
}

setupComponentTest('frost-bunsen-detail', props, tests)
