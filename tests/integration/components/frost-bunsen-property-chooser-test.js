const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'

describeComponent(...integrationTestContext('frost-bunsen-property-chooser'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      bunsenId: 'paymentMethod',
      cellConfig: Ember.Object.create({}),
      model: {},
      onChange () {},
      store: Ember.Object.create({})
    }

    renderWithProps(this, 'frost-bunsen-property-chooser', props)

    rootNode = this.$('> div')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-property-chooser')
  })
})
