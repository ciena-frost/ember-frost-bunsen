import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {beforeEach, describe, it} from 'mocha'

describe('Integration: frost-bunsen-section', function () {
  setupComponentTest('frost-bunsen-section', {
    integration: true
  })

  describe('component', function () {
    let rootNode

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

      rootNode = this.$('> *')
    })

    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-section')
    })
  })

  describe('panel header', function () {
    let rootNode
    let panelHeaderNode

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

      rootNode = this.$('> *')
      panelHeaderNode = rootNode.find('> div:nth-child(1)')
    })

    it('has correct classes', function () {
      expect(panelHeaderNode).to.have.class('frost-bunsen-heading')
    })

    describe('title', function () {
      let titleNode

      beforeEach(function () {
        titleNode = panelHeaderNode.find('h3')
      })

      it('displays correct title', function () {
        expect(titleNode).to.contain(
          this.get('title')
        )
      })
    })
  })

  describe('panel body', function () {
    describe('expanded on initial render', function () {
      let rootNode
      let panelBodyNode
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

        rootNode = this.$('> *')
        panelBodyNode = rootNode.find('> div:nth-child(2)')
      })

      it('has correct classes', function () {
        expect(panelBodyNode).to.have.class('frost-bunsen-body')
      })
    })

    describe('not expanded on initial render', function () {
      let rootNode
      let panelBodyNode
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

        rootNode = this.$('> *')
        panelBodyNode = rootNode.find('> div:nth-child(2)')
      })

      it('has correct classes', function () {
        expect(panelBodyNode).to.have.class('frost-bunsen-body')
      })
    })
  })
})
