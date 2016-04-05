const expect = chai.expect
const {run} = Ember
import {describeComponent, it} from 'ember-mocha'
import {beforeEach} from 'mocha'
import {integrationTestContext} from '../../utils/template'
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

  it('updates the displayed value when the value is changed', function (done) {
    let newValue = {
      firstName: 'Jane',
      lastName: 'Doe',
      alias: 'Killer'
    }

    this.set('value', newValue)
    run.later(() => {
      const firstName = this.$('.frost-bunsen-row:first-child').find('.left-input p').text()
      const lastName = this.$('.frost-bunsen-row:nth-child(2)').find('.left-input p').text()
      const alias = this.$('.frost-bunsen-row:nth-child(3)').find('.left-input p').text()

      expect(firstName).to.equal(newValue.firstName)
      expect(lastName).to.equal(newValue.lastName)
      expect(alias).to.equal(newValue.alias)

      done()
    })
  })
})
