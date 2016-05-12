import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {integrationTestContext, renderWithProps} from 'dummy/tests/helpers/template'
import _ from 'lodash'
import {builtInRenderers} from 'ember-frost-bunsen/validator/index'

function makeProps (props) {
  return _.merge({
    bunsenId: 'bunsen-test-id',
    cellConfig: Ember.Object.create({}),
    model: {type: 'string'},
    onChange () {},
    readOnly: false,
    required: false,
    store: Ember.Object.create({
      renderers: builtInRenderers
    })
  }, props)
}

describeComponent(...integrationTestContext('frost-bunsen-input-wrapper'), function () {
  it('renders', function () {
    const props = makeProps()

    renderWithProps(this, 'frost-bunsen-input-wrapper', props)

    expect(this.$()).to.have.length(1)
  })

  it('supports string model type', function () {
    const props = makeProps()

    renderWithProps(this, 'frost-bunsen-input-wrapper', props)

    expect(this.$()).to.have.length(1)
  })

  it('supports number model type', function () {
    const props = makeProps({
      model: {
        type: 'number'
      }
    })

    renderWithProps(this, 'frost-bunsen-input-wrapper', props)

    expect(this.$()).to.have.length(1)
  })

  it('supports boolean model type', function () {
    const props = makeProps({
      model: {
        type: 'boolean'
      }
    })

    renderWithProps(this, 'frost-bunsen-input-wrapper', props)

    expect(this.$()).to.have.length(1)
  })

  it('does not render if the model is not defined', function () {
    const props = makeProps()
    delete props.model
    renderWithProps(this, 'frost-bunsen-input-wrapper', props)
    expect(this.$('.frost-bunsen-input-wrapper').children()).to.have.length(0)
  })
  it('throws an error if the model does not have an expected type (string, number, or boolean)', function () {
    const props = makeProps({
      model: {
        type: 'unsupported'
      }
    })

    expect(function () {
      renderWithProps(this, 'frost-bunsen-inout', props)
    }).to.throw()
  })
})
