const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'

describeComponent(...integrationTestContext('frost-bunsen-row'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      cellConfigs: [],
      model: {},
      onChange () {},
      store: Ember.Object.create({})
    }

    renderWithProps(this, 'frost-bunsen-row', props)

    rootNode = this.$('> div')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-row')
  })
})
