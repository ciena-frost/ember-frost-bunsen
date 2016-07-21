import {expect} from 'chai'
import {describe, it} from 'mocha'
import * as listUtils from 'ember-frost-bunsen/list-utils'

describe('Unit: list-utils', () => {
  describe('getEnumValues()', () => {
    it('returns literal values', () => {
      const values = ['Foo', 'BAR', 'baz']
      expect(listUtils.getEnumValues(values)).to.eql([
        {
          label: 'Foo',
          value: 'Foo'
        },
        {
          label: 'BAR',
          value: 'BAR'
        },
        {
          label: 'baz',
          value: 'baz'
        }
      ])
    })
  })
})
