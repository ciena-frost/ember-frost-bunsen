const expect = chai.expect
import Ember from 'ember'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {renderWithProps, integrationTestContext} from '../../utils/template'

describeComponent(...integrationTestContext('frost-bunsen-input-static'), function () {
  let rootNode

  const TEST_VALUE = 'Some Test Value'

  beforeEach(function () {
    let props = {
      bunsenId: 'name',
      cellConfig: Ember.Object.create({}),
      model: {},
      onChange () {},
      store: Ember.Object.create({}),
      value: TEST_VALUE
    }

    rootNode = renderWithProps(this, 'frost-bunsen-input-static', props)
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-input-static')
  })

  it('display the value contained in the component state', function () {
    let displayedValue = this.$('.left-input p').html()

    expect(displayedValue).to.equal(TEST_VALUE)
  })
})
