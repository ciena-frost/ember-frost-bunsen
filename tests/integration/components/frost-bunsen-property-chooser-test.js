import {expect} from 'chai'
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'

describeComponent(...integrationTestContext('frost-bunsen-property-chooser'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      bunsenId: 'paymentMethod',
      bunsenModel: {},
      bunsenStore: Ember.Object.create({}),
      cellConfig: Ember.Object.create({}),
      onChange () {}
    }

    renderWithProps(this, 'frost-bunsen-property-chooser', props)

    rootNode = this.$('> div')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-property-chooser')
  })
})
