import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'

describeComponent(...integrationTestContext('frost-bunsen-row'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      bunsenModel: {},
      bunsenStore: Ember.Object.create({}),
      cellConfigs: [],
      onChange () {}
    }

    renderWithProps(this, 'frost-bunsen-row', props)

    rootNode = this.$('> div')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-row')
  })
})
