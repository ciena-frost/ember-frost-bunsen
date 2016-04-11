const expect = chai.expect
import {describeComponent, it} from 'ember-mocha'
import {beforeEach, describe} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'

const COMPONENT_NAME = 'frost-bunsen-section'

describeComponent(...integrationTestContext(COMPONENT_NAME), function () {
  describe('component', function () {
    let rootNode

    beforeEach(function () {
      let props = {
        expandedOnInitialRender: true,
        title: 'Lorem Ipsum'
      }

      rootNode = renderWithProps(this, COMPONENT_NAME, props)
    })

    it('has correct classes', function () {
      expect(rootNode).to.have.class('frost-bunsen-section')
    })
  })

  describe('panel header', function () {
    let rootNode
    let panelHeaderNode

    beforeEach(function () {
      let props = {
        expandedOnInitialRender: true,
        title: 'Lorem Ipsum'
      }

      rootNode = renderWithProps(this, COMPONENT_NAME, props)
      panelHeaderNode = rootNode.find('> div:nth-child(1)')
    })

    it('has correct classes', function () {
      expect(panelHeaderNode).to.have.class('heading')
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
        let props = {
          expandedOnInitialRender: true,
          title: 'Lorem Ipsum'
        }

        rootNode = renderWithProps(this, COMPONENT_NAME, props)
        panelBodyNode = rootNode.find('> div:nth-child(2)')
      })

      it('has correct classes', function () {
        expect(panelBodyNode).to.have.class('body')
      })
    })

    describe('not expanded on initial render', function () {
      let rootNode
      let panelBodyNode
      beforeEach(function () {
        let props = {
          expandedOnInitialRender: false,
          title: 'Lorem Ipsum'
        }

        rootNode = renderWithProps(this, COMPONENT_NAME, props)
        panelBodyNode = rootNode.find('> div:nth-child(2)')
      })

      it('has correct classes', function () {
        expect(panelBodyNode).to.have.class('body')
      })
    })
  })
})
