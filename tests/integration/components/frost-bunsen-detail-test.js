import {expect} from 'chai'
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {integrationTestContext} from 'dummy/tests/helpers/template'
import hbs from 'htmlbars-inline-precompile'

describeComponent(...integrationTestContext('frost-bunsen-detail'), function () {
  let rootNode

  beforeEach(function () {
    let props = {
      model: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            title: 'First Name'
          },
          lastName: {
            type: 'string',
            title: 'Last Name'
          },
          alias: {
            type: 'string',
            title: 'Alias'
          }
        }
      },
      value: {
        firstName: 'John',
        lastName: 'Doe',
        alias: 'Johnny'
      }
    }

    this.setProperties(props)

    this.render(hbs`{{frost-bunsen-detail
    model=model
    value=value
    view=bunsenView
    }}`)

    rootNode = this.$('> *')
  })

  it('has correct classes', function () {
    expect(rootNode).to.have.class('frost-bunsen-detail')
  })

  it('displays initial value', function () {
    const displayValue = {
      firstName: this.$('.frost-bunsen-row:first-child').find('.left-input p').text(),
      lastName: this.$('.frost-bunsen-row:nth-child(2)').find('.left-input p').text(),
      alias: this.$('.frost-bunsen-row:nth-child(3)').find('.left-input p').text()
    }
    expect(displayValue).to.eql({
      firstName: 'John',
      lastName: 'Doe',
      alias: 'Johnny'
    })
  })

  it('updates the displayed value when the value is changed', function () {
    let newValue = {
      firstName: 'Jane',
      lastName: 'Doe',
      alias: 'Killer'
    }

    this.set('value', newValue)

    const firstName = this.$('.frost-bunsen-row:first-child').find('.left-input p').text()
    const lastName = this.$('.frost-bunsen-row:nth-child(2)').find('.left-input p').text()
    const alias = this.$('.frost-bunsen-row:nth-child(3)').find('.left-input p').text()

    expect(firstName).to.equal(newValue.firstName)
    expect(lastName).to.equal(newValue.lastName)
    expect(alias).to.equal(newValue.alias)
  })

  it('displays an error message if the model is not valid', function () {
    this.set('model', {type: 'invalid'})
    const errorMessage = this.$('.frost-bunsen-detail .frost-bunsen-validation-result h4').text()
    expect(errorMessage).to.equal('There seems to be something wrong with your schema')
  })

  it('displays an error message if the model is not valid', function () {
    const invalidView = {
      version: '1.0',
      type: 'form',
      containers: [
        {
          id: 'main',
          rows: [
            [{model: 'some.non-existing.property'}]
          ]
        }
      ],
      buttonLabels: {
        submit: 'Create',
        reset: 'Clear'
      },
      rootContainers: [{label: 'Main', container: 'main'}]
    }
    this.set('bunsenView', invalidView)

    const errorMessage = this.$('.frost-bunsen-detail .frost-bunsen-validation-result h4').text()
    expect(errorMessage).to.equal('There seems to be something wrong with your schema')
  })
})
