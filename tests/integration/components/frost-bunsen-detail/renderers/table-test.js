import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {beforeEach, describe, it} from 'mocha'

import {expectCollapsibleHandles} from 'dummy/tests/helpers/ember-frost-bunsen'
import {setupDetailComponentTest} from 'dummy/tests/helpers/utils'

describe('Integration: Component / frost-bunsen-detail / renderer / table', function () {
  setupDetailComponentTest({
    bunsenModel: {
      properties: {
        things: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              foo: {type: 'string'},
              bar: {type: 'string'},
              baz: {type: 'string'}
            }
          }
        }
      },
      type: 'object'
    },
    bunsenView: {
      cells: [
        {
          children: [
            {
              label: 'Simple',
              model: 'things',
              renderer: {
                name: 'table'
              }
            }
          ]
        }
      ],
      type: 'form',
      version: '2.0'
    },
    value: {
      things: [
        {foo: 'hello', bar: 'there', bazz: 'buddy'},
        {foo: 'i\'m not', bar: 'your buddy', bazz: 'guy'},
        {foo: 'i\'m not', bar: 'your guy', bazz: 'pal'}
      ]
    }
  })

  it('renders as expected', function () {
    expectCollapsibleHandles(0, 'bunsenDetail')

    expect(
      this.$('.frost-table'),
      'renders a frost table'
    )
      .to.have.length(1)
  })

  describe('when using data to derive columns', function () {
    it('renders as expected', function () {
      const headers = this.$('.frost-table .frost-table-header th')

      expect(
        headers,
        'renders a bunsen password input'
      )
        .to.have.length(3)

      expect(
        this.$(headers[0]).text().trim(),
        'renders correct first column'
      )
        .to.equal('foo')

      expect(
        this.$(headers[1]).text().trim(),
        'renders correct second column'
      )
        .to.equal('bar')

      expect(
        this.$(headers[2]).text().trim(),
        'renders correct third column'
      )
        .to.equal('bazz')

      const values = this.$('.frost-table tbody tr:first-child td')

      expect(
        this.$(values[0]).text().trim(),
        'renders correct first value'
      )
        .to.equal('hello')

      expect(
        this.$(values[1]).text().trim(),
        'renders correct second value'
      )
        .to.equal('there')

      expect(
        this.$(values[2]).text().trim(),
        'renders correct third value'
      )
        .to.equal('buddy')
    })
  })

  describe('when using column overrides', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'With column overrides',
            model: 'things',
            renderer: {
              name: 'table',
              columns: [
                'bazz',
                'foo'
              ]
            }
          }
        ],
        type: 'detail',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      const headers = this.$('.frost-table .frost-table-header th')
      expect(
        headers,
        'renders the correct amount of columns'
      )
        .to.have.length(2)

      expect(
        this.$(headers[0]).text().trim(),
        'renders correct first column'
      )
        .to.equal('bazz')

      expect(
        this.$(headers[1]).text().trim(),
        'renders correct second column'
      )
        .to.equal('foo')

      const values = this.$('.frost-table tbody tr:first-child td')

      expect(
        this.$(values[0]).text().trim(),
        'renders correct first value'
      )
        .to.equal('buddy')

      expect(
        this.$(values[1]).text().trim(),
        'renders correct second value'
      )
        .to.equal('hello')
    })
  })

  describe('when using column overrides with label overrides', function () {
    beforeEach(function () {
      this.set('bunsenView', {
        cells: [
          {
            label: 'With column & label overrides',
            model: 'things',
            renderer: {
              name: 'table',
              columns: [
                'foo',
                {
                  key: 'bar',
                  label: 'BAR'
                },
                'bazz'
              ]
            }
          }
        ],
        type: 'detail',
        version: '2.0'
      })

      return wait()
    })

    it('renders as expected', function () {
      const headers = this.$('.frost-table .frost-table-header th')
      expect(
        headers,
        'renders the correct amount of columns'
      )
        .to.have.length(3)

      expect(
        this.$(headers[0]).text().trim(),
        'renders correct first column'
      )
        .to.equal('foo')

      expect(
        this.$(headers[1]).text().trim(),
        'renders correct second column'
      )
        .to.equal('BAR')

      expect(
        this.$(headers[2]).text().trim(),
        'renders correct second column'
      )
        .to.equal('bazz')
    })
  })
})
