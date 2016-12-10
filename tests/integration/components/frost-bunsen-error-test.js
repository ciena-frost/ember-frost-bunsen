import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import {beforeEach, describe, it} from 'mocha'
import hbs from 'htmlbars-inline-precompile'

describe('Integration: FrostBunsenError', function () {
  setupComponentTest('frost-bunsen-error', {
    integration: true
  })

  beforeEach(function () {
    this.setProperties({
      data: {
        message: 'Things are borked',
        path: '#/name'
      }
    })
  })

  describe('warning', function () {
    let rootNode

    beforeEach(function () {
      this.render(hbs`{{frost-bunsen-error data=data warning=true}}`)
      rootNode = this.$('> div')
    })

    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-error')
      expect(rootNode).to.have.class('frost-bunsen-alert-warning')
    })

    it('displays data path', function () {
      expect(rootNode).to.contain(
        this.get('data.path')
      )
    })

    it('displays data message', function () {
      expect(rootNode).to.contain(
        this.get('data.message')
      )
    })
  })
})
