import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: frost-bunsen-section', function () {
  setupComponentTest('frost-bunsen-section', {
    integration: true
  })

  describe('component', function () {
    beforeEach(function () {
      this.setProperties({
        expandedOnInitialRender: true,
        required: false,
        title: 'Lorem Ipsum'
      })

      this.render(hbs`{{frost-bunsen-section
        expandedOnInitialRender=expandedOnInitialRender
        required=required
        title=title
      }}`)
    })

    it('has correct classes', function () {
      expect(this.$('> *')).to.have.class('frost-bunsen-section')
    })
  })

  describe('panel header', function () {
    beforeEach(function () {
      this.setProperties({
        expandedOnInitialRender: true,
        required: false,
        title: 'Lorem Ipsum'
      })

      this.render(hbs`{{frost-bunsen-section
        expandedOnInitialRender=expandedOnInitialRender
        required=required
        title=title
      }}`)
    })

    it('has correct classes', function () {
      expect(this.$('> *').find('> div:nth-child(1)')).to.have.class('frost-bunsen-heading')
    })

    it('displays correct title', function () {
      expect(this.$('> *').find('> div:nth-child(1)').find('h3')).to.contain(
        this.get('title')
      )
    })
  })

  describe('panel body', function () {
    describe('expanded on initial render', function () {
      beforeEach(function () {
        this.setProperties({
          expandedOnInitialRender: true,
          required: false,
          title: 'Lorem Ipsum'
        })

        this.render(hbs`{{frost-bunsen-section
          expandedOnInitialRender=expandedOnInitialRender
          required=required
          title=title
        }}`)
      })

      it('has correct classes', function () {
        expect(this.$('> *').find('> div:nth-child(2)')).to.have.class('frost-bunsen-body')
      })
    })

    describe('not expanded on initial render', function () {
      beforeEach(function () {
        this.setProperties({
          expandedOnInitialRender: false,
          required: false,
          title: 'Lorem Ipsum'
        })

        this.render(hbs`{{frost-bunsen-section
          expandedOnInitialRender=expandedOnInitialRender
          required=required
          title=title
        }}`)
      })

      it('has correct classes', function () {
        expect(this.$('> *').find('> div:nth-child(2)')).to.have.class('frost-bunsen-body')
      })
    })
  })
})
