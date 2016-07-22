import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'
import _ from 'lodash'
import {builtInRenderers} from 'bunsen-core/validator'

function makeProps (props) {
  return _.merge({
    bunsenId: 'bunsen-test-id',
    bunsenModel: {type: 'string'},
    bunsenStore: Ember.Object.create({
      renderers: builtInRenderers
    }),
    cellConfig: Ember.Object.create({}),
    onChange () {},
    readOnly: false,
    required: false
  }, props)
}

describeComponent(...integrationTestContext('frost-bunsen-input-wrapper'), function () {
  it('does not render if the bunsenModel is not defined', function () {
    const props = makeProps()
    delete props.bunsenModel
    renderWithProps(this, 'frost-bunsen-input-wrapper', props)
    expect(this.$('.frost-bunsen-input-wrapper').children()).to.have.length(0)
  })
  it('throws an error if the bunsenModel does not have an expected type (string, number, or boolean)', function () {
    const props = makeProps({
      bunsenModel: {
        type: 'unsupported'
      }
    })

    expect(function () {
      renderWithProps(this, 'frost-bunsen-inout', props)
    }).to.throw()
  })
})
