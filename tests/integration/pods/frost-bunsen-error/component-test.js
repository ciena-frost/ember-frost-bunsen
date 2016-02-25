const expect = chai.expect
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import hbs from 'htmlbars-inline-precompile'

describeComponent(
  'frost-bunsen-error',
  'Integration: FrostBunsenError',
  {
    integration: true
  },
  function () {
    beforeEach(function () {
      this.setProperties({
        data: {
          message: 'Things are borked',
          path: '#/name'
        }
      })
    })

    describe('error', function () {
      let rootNode

      beforeEach(function () {
        this.render(hbs`{{frost-bunsen-error data=data}}`)
        rootNode = this.$('> div')
      })

      it('has correct classes', function () {
        expect(rootNode).to.have.class('frost-bunsen-error')
        expect(rootNode).to.have.class('alert-danger')
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

    describe('warning', function () {
      let rootNode

      beforeEach(function () {
        this.render(hbs`{{frost-bunsen-error data=data warning=true}}`)
        rootNode = this.$('> div')
      })

      it('has correct classes', function () {
        expect(rootNode).to.have.class('frost-bunsen-error')
        expect(rootNode).to.have.class('alert-warning')
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
  }
)
