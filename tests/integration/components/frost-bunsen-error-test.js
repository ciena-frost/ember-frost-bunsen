import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

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
    beforeEach(function () {
      this.render(hbs`{{frost-bunsen-error data=data warning=true}}`)
    })

    it('has correct classes', function () {
      const rootNode = this.$('> div')
      expect(rootNode).to.have.class('frost-bunsen-error')
      expect(rootNode).to.have.class('frost-bunsen-alert-warning')
    })

    it('displays data path', function () {
      expect(this.$('> div')).to.contain(
        this.get('data.path')
      )
    })

    it('displays data message', function () {
      expect(this.$('> div')).to.contain(
        this.get('data.message')
      )
    })
  })
})
