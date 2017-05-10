import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

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

describe('Integration: frost-bunsen-form', function () {
  setupComponentTest('frost-bunsen-form', {
    integration: true
  })

  beforeEach(function () {
    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-form
      options=options
    }}`)

    return wait()
  })

  describe('spread', function () {
    it('renders input', function () {
      expect(this.$('> *').find('.frost-text').length).to.equal(1)
    })
  })
})
