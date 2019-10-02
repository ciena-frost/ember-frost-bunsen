import { find } from '@ember/test-helpers';
import {expect} from 'chai'
import {setupComponentTest} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

describe('Integration: frost-bunsen-detail', function () {
  setupComponentTest('frost-bunsen-detail', {
    integration: true
  })

  beforeEach(function () {
    let props = {
      bunsenModel: {
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
      bunsenModel=bunsenModel
      bunsenView=bunsenView
      value=value
    }}`)

    return wait()
  })

  it('has correct classes', function () {
    expect(this.$('> *')).to.have.class('frost-bunsen-detail')
  })

  it('displays initial value', function () {
    const $values = this.$('.frost-bunsen-left-input p')
    const displayValue = {
      firstName: $values.eq(0).text(),
      lastName: $values.eq(1).text(),
      alias: $values.eq(2).text()
    }
    expect(displayValue).to.eql({
      firstName: 'John',
      lastName: 'Doe',
      alias: 'Johnny'
    })
  })

  describe('when value is changed', function () {
    let newValue

    beforeEach(function () {
      newValue = {
        firstName: 'Jane',
        lastName: 'Doe',
        alias: 'Killer'
      }

      this.set('value', newValue)

      return wait()
    })

    afterEach(function () {
      newValue = null
    })

    it('updates the displayed value when the value is changed', function () {
      const $values = this.$('.frost-bunsen-left-input p')
      const firstName = $values.eq(0).text()
      const lastName = $values.eq(1).text()
      const alias = $values.eq(2).text()

      expect(firstName).to.equal(newValue.firstName)
      expect(lastName).to.equal(newValue.lastName)
      expect(alias).to.equal(newValue.alias)
    })
  })

  describe('when bunsenModel is not valid', function () {
    beforeEach(function () {
      this.set('bunsenModel', {type: 'invalid'})
      return wait()
    })

    it('displays an error message', function () {
      const errorMessage = find('.frost-bunsen-detail .frost-bunsen-validation-result h4').textContent.trim()
      expect(errorMessage).to.equal('There seems to be something wrong with your model schema')
    })
  })

  describe('when bunsenView references an invalid model property', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cellDefinitions: {
          main: {
            children: [
              {model: 'some.non-existing.property'}
            ]
          }
        },
        cells: [{extends: 'main'}],
        type: 'form',
        version: '2.0'
      })

      return wait()
    })

    it('displays an error message', function () {
      const errorMessage = find('.frost-bunsen-detail .frost-bunsen-validation-result h4').textContent.trim()
      expect(errorMessage).to.equal('There seems to be something wrong with your view schema')
    })
  })
})
