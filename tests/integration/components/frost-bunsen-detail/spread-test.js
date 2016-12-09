import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe} from 'mocha'
import {integrationTestContext} from 'dummy/tests/helpers/template'

const props = {
  options: {
    bunsenModel: {
      properties: {
        foo: {type: 'string'}
      },
      type: 'object'
    },
    bunsenView: {
      cellDefinitions: {
        main: {
          children: [
            {model: 'foo'}
          ]
        }
      },
      cells: [{extends: 'main'}],
      type: 'form',
      version: '2.0'
    }
  }
}

function tests (ctx) {
  describe('spread', function () {
    it('renders input', function () {
      expect(ctx.rootNode.find('.frost-bunsen-input-static').length).to.equal(1)
    })
  })
}

describeComponent(...integrationTestContext('frost-bunsen-detail'),
  function () {
    let ctx = {}
    beforeEach(function () {
      this.setProperties(props)
      this.render(hbs`{{frost-bunsen-detail
        options=options
      }}`)
      ctx.rootNode = this.$('> *')
    })

    tests(ctx)
  }
)
